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
})

app.get('/', (req, res) => {
    return res.json("From Backend Side");
})

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar a tabela users.", details: err });
        return res.json(data);
    }) 
})
app.get('/users/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE `id` = ?";
    const userId = req.params.id;

    db.query(sql, [userId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]); // Assuming `data` returns an array, `data[0]` will be the single user object
    });
});
 

app.post('/users', (req, res) => {
    const sql = "INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.nome, 
        req.body.email, 
        req.body.password, 
        req.body.role
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.json({message: 'Something unexpected has occured' + err})
        return res.json({success: 'Utilizador criado com sucesso' });
    });
});

app.put('/users:id', (req, res) => {
    const sql = "UPDATE users SET `nome` = ?, `email` = ?, `password` = ?, `role` = ? WHERE `id` = ?";

    const values = [
        req.body.nome,
        req.body.email,
        req.body.password,
        req.body.role
    ];

    db.query(sql, [...values, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Utilizador atualizado com sucesso.")
    })
})

app.delete('/users:id', (req, res) => {
    const sql = "DELETE FROM users WHERE `id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Utilizador deletado com sucesso.")
    })
})


app.get('/sensors', (req, res) => {
    const sql = "SELECT * FROM sensors";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar a tabela sensors.", details: err });
        return res.json(data);
    });
});

app.get('/config_sensor', (req, res) => {
    const sql = "SELECT * FROM config_sensor";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar a tabela config_sensor.", details: err });
        return res.json(data);
    });
});

app.get('/read_sensor', (req, res) => {
    const sql = "SELECT * FROM read_sensors";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar a tabela read_sensors.", details: err });
        return res.json(data);
    });
});

app.get('/warning', (req, res) => {
    const sql = "SELECT * FROM warning";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar a tabela warning.", details: err });
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Servidor ouvindo na porta 8081");
});