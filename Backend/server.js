const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ShadowKnight1305+',
    database: 'climatizacao_salas',
})

app.get('/', (req, res) => {
    return res.json("From Backend Side");
})

app.get('/users', (req, res) => {
    const sql = `SELECT users.*, roles.RoleName AS role_name FROM users LEFT JOIN roles ON users.role_id = roles.RoleID`;
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar os utilizadores.", details: err });
        return res.json(data); // Retorna todos os utilizadores com a Role
    });
});
app.get('/users/:id', (req, res) => {
    const sql = "SELECT users.*, roles.RoleName AS role_name FROM users LEFT JOIN roles ON users.role_id = roles.RoleID WHERE `id` = ?";
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

app.put('/users/:id', (req, res) => {
    console.log("Updating user with ID:", req.params.id); // Debug
    console.log("Data received for update:", req.body); // Debug

    const sql = "UPDATE users SET `nome` = ?, `email` = ?, `role_id` = ? WHERE `id` = ?";
    
    const values = [
        req.body.nome,
        req.body.email,
        req.body.role_id
    ];

    db.query(sql, [...values, req.params.id], (err, result) => {
        if (err) {
            console.error("Error updating user:", err); // Debugging error
            return res.status(500).json({ error: "Erro ao atualizar utilizador", details: err });
        }

        console.log("User updated successfully:", result);
        return res.status(200).json({ success: "Utilizador atualizado com sucesso." });
    });
});


app.delete('/users/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE `id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json({ success: "Utilizador deletado com sucesso." })
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