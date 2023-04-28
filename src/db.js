const { createPool } = require("mysql2")
const test = true
require('dotenv').config();
const con = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: test ? "fnd_test" : "fnd"
})

con.getConnection((err) => {
    if (err) {
        console.log("error connecting to db:", err)
    } else {
        console.log("connected to db")
    }
})
module.exports = con