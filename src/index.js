require("dotenv").config();
const express = require("express");


const pg = require("pg");
const {Pool} = pg;

const pool = new Pool();

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.get('/leaderboard/', async (req, res) => {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM leaderboard");
    res.json(result.rows);
    client.release();
})

app.post('/leaderboard/', async (req, res) => {
    const body = req.body;
    const client = await pool.connect();
    await client.query(`INSERT INTO leaderboard (username, score, "timeSurvived", "timeSubmitted") VALUES ($1, $2, $3, $4)`, [body.username, body.score, body.time, Math.floor(Date.now() / 1000)]);
    const result = await client.query("SELECT * FROM leaderboard");
    res.json(result.rows);
    client.release();
})



app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})