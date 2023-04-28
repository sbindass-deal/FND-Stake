const ethers = require("ethers");
const express = require('express');
const con = require('./db.js')
const bodyParser = require("body-parser");
const router = express.Router()
const app = express();
const PORT = 3353
const cors = require('cors')
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const pattern = /^0x[a-fA-F0-9]{40}$/
const abi = require('./abis/votes.json')
const config = require('./config.js')
const test = config.test
const providers = config.providers
const chain = test ? 5 : 1;
const contractAddress = config.votesAddress[chain].toLocaleLowerCase()
const provider = new ethers.providers.JsonRpcProvider(providers[chain]);
let cb = 0
let latestBlock = 0
const startDelay = 50
const blockDelay = test ? 0 : 2;
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const limiter = rateLimit({
    windowMs: 1000, // 15 minutes
    max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
})

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/", router)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(limiter)
app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    }
    else {
        console.log("Error occurred, server can't start", error)
    }
});


const main = async () => {

    latestBlock = await provider.getBlockNumber();

    cb = latestBlock - startDelay;
    console.log("Starting from block", cb);
    while (1) {
        try {
            latestBlock = await provider.getBlockNumber()
            if (cb >= latestBlock - blockDelay) {
                await sleep(1400)
            } else {
                console.log("handle block:", cb)
                handleBlock(cb)
                cb += 1
                await sleep(200)
            }
        } catch (err) {
            console.log("err main loop", err)
            await sleep(500)
        }
    }
}
const handleBlock = async function (blockNumber) {
    try {
        for (let i = 0; i < 10; i++) {
            const bl = await provider.getBlockWithTransactions(blockNumber)
            if (!bl) {
                console.log("block null, retry...", i + 1)
                await sleep(400)
                continue
            }
            txs = bl.transactions
            console.log(txs.length, "txs in block", blockNumber)
            txs.forEach(async (element) => {
                if (element.to && element.to.toLowerCase() == contractAddress) {
                    handle(element)
                }
            });
            break
        }

    } catch (err) {
        console.log("err with block", err, blockNumber)
    }
}

const handle = async function (tx) {
    try {
        // const get topics of tx
        const tx2 = await provider.getTransactionReceipt(tx.hash)
        if (tx.data.toLocaleLowerCase() === "0x180fd87f" &&  tx2.status === 1) {
            // handle create proposal
            const from = tx.from.toLocaleLowerCase()
            console.log("handle create proposal")
            await Promise.all(tx2.logs.map(
                async (log) => {
                    if (log.topics[0] === "0x3750df2de6d512cea6e6ab3f91b9b12b38d84c36719ee1279312531f6d098747"){
                        const id = parseInt(log.topics[1])
                        console.log(id)
                        // insert into db
                        // get proposal with id from db
                        const sql = "SELECT * FROM proposals WHERE hash = ?"
                        try {
                            const [rows, fields] = await con.promise().query(sql, [tx.hash])
                            if (rows.length == 1) {
                                const sql = "UPDATE proposals SET id = ?, confirmed = ?, creator = ?, updated_at = ? WHERE hash = ?"
                                await con.promise().query(sql, [id, true, from, new Date(), tx.hash])
                                console.log("proposal", id, "confirmed")
                            }
                        } catch (err) {
                            console.log("err with query", err)
                        }
                    }
                }
            ))
        } else if (tx.data.slice(0,10).toLocaleLowerCase() === "0x45979eb1" &&  tx2.status === 1) {
            // handle vote
            console.log("handle vote")
            await Promise.all(tx2.logs.map(
                async (log) => {
                    if (log.topics[0] === "0x674458bec69b19be42c3af3588ef318d905afd8a86487137b14ddb0073bed6a0"){
                        const id = parseInt(log.topics[2])
                        const from = "0x" + log.topics[1].slice(26,66).toLocaleLowerCase()
                        console.log(log.data)
                        const voteAmount = parseInt(log.data.slice(0,66), 16)
                        const vote = parseInt("0x" + log.data.slice(66,), 16) == 0 ? false : true
                        console.log(id, from, vote, "amount:",voteAmount)
                        // update proposal
                        //insert to votes
                        const sql1 = "INSERT INTO votes (proposal_id, hash, address, vote_count, vote) VALUES (?, ?, ?, ?, ?)"
                        const sql_yes = "UPDATE proposals SET yes_votes = yes_votes + ?, updated_at = ? WHERE id = ?"
                        const sql_no = "UPDATE proposals SET no_votes = no_votes + ?, updated_at = ? WHERE id = ?"

                        try {
                            await con.promise().query(sql1, [id, tx.hash, from, voteAmount, vote])
                            if (vote) {
                                await con.promise().query(sql_yes, [voteAmount, new Date(), id])
                            } else {
                                await con.promise().query(sql_no, [voteAmount, new Date(), id])
                            }
                            
                            console.log("vote", id, "added")
                        } catch (err) {
                            console.log("err with query", err)
                        }
                    }
                }
            ))
        }


        // const contract = new ethers.Contract(contractAddress[chain], abi, provider);
        // const address = tx.from.toLocaleLowerCase()
        // let bids = await contract.getBids(address);
        // await Promise.all(bids.map(async (bid, index) => {
        //     try {
        //         const query = {
        //             text: 'INSERT INTO bidsv2 (address, bidIndex, amount) VALUES ($1, $2, $3)',
        //             values: [address, index, parseFloat(ethers.utils.formatEther(bid[1]))],
        //         }
        //         await client.query(query)
        //         console.log("First insert", address, index, parseFloat(ethers.utils.formatEther(bid[1])))
        //     } catch (err) {
        //         // console.log("err with query", err)
        //         // if already exists just update
        //         const query = {
        //             text: 'UPDATE bidsv2 SET amount = $1 WHERE address = $2 AND bidIndex = $3',
        //             values: [parseFloat(ethers.utils.formatEther(bid[1])), address, index],
        //         }
        //         await client.query(query)
        //         console.log("Update", address, index, parseFloat(ethers.utils.formatEther(bid[1])))
        //     }
        // }))
        // // insert hash into processed_txs
        // const txWithLogs = await provider.getTransactionReceipt(hash)
        // // check if tx is successful
        // if (txWithLogs.status != 1) {
        //     console.log("tx failed", hash)
        //     return
        // }
        // const bidder = txWithLogs.from.toLocaleLowerCase()
        // const query = {
        //     text: 'INSERT INTO processed_txs (tx_hash, address) VALUES ($1, $2)',
        //     values: [hash, bidder],
        // }
        // await client.query(query)
        // get bid amounts from topics
        // let iface = new ethers.utils.Interface(abi);
        // const logs = txWithLogs.logs.filter((log) => log.topics[0] === "0xc772d8a78568bb5acc81725ba1a7b42aa39111a67271914004bf23dc9bc67bc2")
        // console.log("found bids:", logs.length)
        // await Promise.all(logs.map(async (log) => {
        //     const a = iface.decodeEventLog("UserBid", log.data, log.topics)
        //     const amt = a.amount.toString()
        //     const idx = parseInt(a.idx)
        //     // insert into bids
        //     const query = {
        //         text: 'INSERT INTO bids (address, bidIndex, amount) VALUES ($1, $2, $3)',
        //         values: [bidder, idx, amt],
        //     }
        //     await client.query(query)
        //     console.log("inserted", bidder, idx, amt)
        // }))

    } catch (err) {
        console.log("err with tx", err, hash)
    }
}

router.post('/newProposal', jsonParser, async (req, res) => {
    try {
        console.log(req.body)
        const { title, description, hash } = req.body
        const sql = "INSERT INTO proposals (title, description, hash, created_at) VALUES (?, ?, ?, ?)"
        const [rows, fields] = await con.promise().query(sql, [title, description, hash, new Date()])
        return res.status(200).send({ success: true, id: rows.insertId })

    } catch (err) {
        console.log("err with new proposal", err)
        return res.status(500).send("err with new proposal")
    }
})
router.get('/getProposals', async (req, res) => {
    try {
        const sql1 = "SELECT * FROM proposals where confirmed = true"
        const [rows, fields] = await con.promise().query(sql1)
        let rows1 = rows.map((row) => {
            return {
                ...row,
                percent: row.yes_votes > 0 || row.no_votes > 0 ? 50 + parseInt((row.yes_votes - row.no_votes) / (row.yes_votes + row.no_votes) * 50) : 50
            }
        })
        const exp = new Date(new Date() - config.expirationSeconds * 1000)
        const expired = rows1.filter((row) => new Date(row.created_at) < exp)
        const notExpired = rows1.filter((row) => new Date(row.created_at) >= exp)
        res.status(200).send({ expired, notExpired })
    } catch (err) {
        console.log("err with query", err)
        res.send(err)
    }
})

router.get("/getProposal/:id", async (req, res) => {
    try {
        const sql = "SELECT * FROM proposals WHERE id = ?"
        const [rows, fields] = await con.promise().query(sql, [req.params.id])
        if (rows.length == 1) {
            const row = rows[0]
            const percent = row.yes_votes > 0 || row.no_votes > 0 ? 50 + parseInt((row.yes_votes - row.no_votes) / (row.yes_votes + row.no_votes) * 50) : 50
            res.status(200).send({ ...row, percent })
        } else {
            res.status(404).send("not found")
        }
    } catch (err) {
        console.log("err with query", err)
        res.send(err)
    }
})


main()
// handle("0x605d2ad01262be0e34cff1b1fc9cc421744de075d4931207f7acdbd1eadd9ee6")