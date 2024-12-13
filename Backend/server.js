const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Messi8',
    database: 'climatizacao_salas',
})

app.get('/', (req, res) => {
    return res.json("From Backend Side");
})

app.get('/users', (req, res) => {
    const sql = `SELECT * FROM users`;
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
    const sql = "INSERT INTO users (nome, email, password, role_id) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.nome, 
        req.body.email, 
        req.body.password, 
        req.body.role_id
    ];
    console.log(req.body)

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

app.get('/sensors/:id', (req, res) => {
    const sql = `SELECT sensors.*, 
                 config_sensor.temperatura_max AS temp_max,
                 config_sensor.temperatura_min AS temp_min, 
                 config_sensor.humidade_max AS hum_max, 
                 config_sensor.humidade_min AS hum_min, 
                 read_sensors.temperatura_atual AS temp_atual, 
                 read_sensors.humidade_atual AS hum_atual, 
                 sensor_models.nome_modelo AS modelo_sensor, 
                 sensor_models.fabricante AS fabricante_sensor 
                 FROM sensors 
                 LEFT JOIN config_sensor ON sensors.id_config = config_sensor.id_config 
                 LEFT JOIN read_sensors ON sensors.id_read = read_sensors.id_read 
                 LEFT JOIN sensor_models ON sensors.id_model = sensor_models.id_model 
                 WHERE sensors.id = ?;`;

    const sensorId = req.params.id;

    db.query(sql, [sensorId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]); // Assuming `data` returns an array, `data[0]` will be the single user object
    });
});

app.put('/sensors/:id', (req, res) => {
    console.log("Atualizando sensor com ID:", req.params.id); // Debug
    console.log("Dados recebidos para atualização:", req.body); // Debug

    const sql = "UPDATE sensors SET `nome` = ?, `localizacao` = ?, `estado` = ? WHERE `id` = ?";
    
    const values = [
        req.body.nome,
        req.body.localizacao, 
        req.body.estado
    ];

    db.query(sql, [...values, req.params.id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar sensor:", err); // Debugging error
            return res.status(500).json({ error: "Erro ao atualizar sensor", details: err });
        }

        console.log("Sensor atualizado com sucesso:", result);
        return res.status(200).json({ success: "Sensor atualizado com sucesso." });
    });
});

app.delete('/sensros/:id', (req, res) => {
    const sql = "DELETE FROM sensors WHERE `id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json({ success: "Sensor deletado com sucesso." })
    })
})

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

app.post('/sensors', (req, res) => {
    const sql = "INSERT INTO sensors (nome, localizacao, estado, id_read, id_config, id_model) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.nome, 
        req.body.localizacao, 
        req.body.estado, 
        req.body.id_read, 
        req.body.id_config, 
        req.body.id_model
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ message: 'Something unexpected has occurred: ' + err });
        }
        return res.json({ success: 'Sensor criado com sucesso' });
    });
});
