const test = true;
const votesAbi = require('./abis/votes.json')
const infuraId = "5f1a442cc5f146d5ae884f77273265c4"
const provider =  test ? "https://eth-goerli.g.alchemy.com/v2/WRipeVhYsi0RgGCD1AdwhPkWNjoYkcA9" : "https://speedy-nodes-nyc.moralis.io/5a061dba81ebad3b78c9191e/bsc/mainnet/archive"
const tokenAbi = require('./abis/token.json')
const providers = {
    1: "https://eth-mainnet.alchemyapi.io/v2/WRipeVhYsi0RgGCD1AdwhPkWNjoYkcA9",
    5: "https://eth-goerli.g.alchemy.com/v2/WRipeVhYsi0RgGCD1AdwhPkWNjoYkcA9",

}
const tokenAddress = {
    1: "0x57f6ae922f76de406f4ea14fdc06bc3e675863e0",
    5: "0x57f6ae922f76de406f4ea14fdc06bc3e675863e0"

}
const votesAddress = {
    1 : "",
    5 : "0x6352A789E525654e3487381f8FE09890Ee59FEa2",
}
const url = !test ? "https://fndapi.stakingtoken.io" : "https://fndapi.stakingtoken.io"
const expirationSeconds = 60 * 60 * 24 * 7 // 7 days
module.exports = {
    test,
    votesAbi,
    infuraId,
    provider,
    tokenAbi,
    providers,
    tokenAddress,
    votesAddress,
    expirationSeconds,
    url
}