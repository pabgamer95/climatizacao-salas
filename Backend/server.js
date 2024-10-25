const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'climatizacao_salas',
    port: 5432,
})

app.get('/', (_re,res)=>{
    return res.json("From Backend Side");
})

app.get('/users', (_req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/sensors', (_req, res) => {
    const sql = "SELECT * FROM sensors";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/config_sensor', (_req, res) => {
    const sql = "SELECT * FROM config_sensor";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/read_sensor', (_req, res) => {
    const sql = "SELECT * FROM read_sensors";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/warning', (_req, res) => {
    const sql = "SELECT * FROM warning";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})


app.listen(8081, () => {
    console.log("listening");
})