const con = require('./db');

(async () => {
  try {
    await con.promise().query("CREATE TABLE IF NOT EXISTS votes (hash varchar(66) PRIMARY KEY, address VARCHAR(42), proposal_id INT, vote_count int, vote boolean, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    await con.promise().query("CREATE TABLE IF NOT EXISTS proposals (id bigint, hash varchar(66) PRIMARY KEY, title varchar(255), description varchar(500), image varchar(255), link varchar(255), status varchar(255), creator varchar(255), created_at timestamp, updated_at timestamp, yes_votes int DEFAULT 0, no_votes int DEFAULT 0, approved boolean DEFAULT false, confirmed boolean DEFAULT false)");
  } catch (err) {
    console.error("error executing query:", err);
  }
})().then(() => {
  console.log("done");
  process.exit(0);
}).catch(err => {
  console.error("error:", err);
  process.exit(1);
});