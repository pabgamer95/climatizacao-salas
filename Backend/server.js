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

app.post('/sensors', (req, res) => {
    const { nome, localizacao, nome_modelo, fabricante } = req.body;
    console.log(req.body)

    // Desabilitar a verificação de chaves estrangeiras
    const disableForeignKeysSql = "SET foreign_key_checks = 0;";
    db.query(disableForeignKeysSql, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao desabilitar as chaves estrangeiras.", details: err });
        }

        // 1. Inserir o sensor na tabela 'sensors'
        const insertSensorSql = "INSERT INTO sensors (nome, localizacao) VALUES (?, ?)";
        db.query(insertSensorSql, [nome, localizacao], (err, result) => {

            console.log(insertSensorSql)
            console.log([nome, localizacao])
            console.log(err)
            console.log(result)

            if (err) {
                return res.status(500).json({ error: "Erro ao inserir o sensor.", details: err });
            }

            const sensorId = result.insertId;  // O id do sensor recém-criado
            console.log(sensorId)

            // 2. Atualizar o sensor com os valores id_read, id_config, e id_model iguais ao sensorId
            const updateSensorSql = "UPDATE sensors SET id_read = ?, id_config = ?, id_model = ? WHERE id = ?";
            db.query(updateSensorSql, [sensorId, sensorId, sensorId, sensorId], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao atualizar o sensor com os ids.", details: err });
                }

                // 3. Inserir a referência na tabela 'read_sensors' com o id do sensor
                const insertReadSensorsSql = "INSERT INTO read_sensors (id_read, temperatura_atual, humidade_atual) VALUES (?, ?, ?)";
                db.query(insertReadSensorsSql, [sensorId, "19.5", "50"], (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Erro ao inserir a referência na tabela read_sensors.", details: err });
                    }

                    // 4. Inserir a referência na tabela 'config_sensor' com o id do sensor
                    const insertConfigSensorSql = "INSERT INTO config_sensor (id_config) VALUES (?)";
                    db.query(insertConfigSensorSql, [sensorId], (err) => {
                        if (err) {
                            return res.status(500).json({ error: "Erro ao inserir a referência na tabela config_sensor.", details: err });
                        }

                        // 5. Inserir as informações na tabela 'sensor_model' com o modelo e fabricante, e associar o id do sensor
                        const insertSensorModelSql = "INSERT INTO sensor_models (id_model, nome_modelo, fabricante) VALUES (?, ?, ?)";
                        db.query(insertSensorModelSql, [sensorId, nome_modelo, fabricante], (err) => {
                            if (err) {
                                return res.status(500).json({ error: "Erro ao inserir as informações do sensor na tabela sensor_model.", details: err });
                            }

                            // Reabilitar as chaves estrangeiras após a operação
                            const enableForeignKeysSql = "SET foreign_key_checks = 1;";
                            db.query(enableForeignKeysSql, (err) => {
                                if (err) {
                                    return res.status(500).json({ error: "Erro ao reabilitar as chaves estrangeiras.", details: err });
                                }

                                // Se tudo correr bem, retornar sucesso
                                return res.status(201).json({ success: "Sensor e referências inseridos com sucesso.", sensorId: sensorId });
                            });
                        });
                    });
                });
            });
        });
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

app.delete('/sensors/:id', (req, res) => {
    const sensorId = req.params.id;

    // Desabilitar a verificação de chaves estrangeiras
    const disableForeignKeysSql = "SET foreign_key_checks = 0;";
    db.query(disableForeignKeysSql, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao desabilitar as chaves estrangeiras.", details: err });
        }
        // 1. Eliminar as referências na tabela read_sensors
        const deleteReadSensorsSql = "DELETE FROM read_sensors WHERE id_read = ?";
        db.query(deleteReadSensorsSql, [sensorId], (err) => {
            if (err) return res.status(500).json({ error: "Erro ao eliminar referências na tabela read_sensors.", details: err });

            // 2. Eliminar as referências na tabela config_sensor
            const deleteConfigSensorSql = "DELETE FROM config_sensor WHERE id_config = ?";
            db.query(deleteConfigSensorSql, [sensorId], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao eliminar referências na tabela config_sensor.", details: err });

                // 3. Eliminar as referências na tabela sensor_model
                const deleteSensorModelSql = "DELETE FROM sensor_models WHERE id_model = ?";
                db.query(deleteSensorModelSql, [sensorId], (err) => {
                    if (err) return res.status(500).json({ error: "Erro ao eliminar referências na tabela sensor_model.", details: err });

                    // 4. Eliminar o sensor da tabela sensors
                    const deleteSensorSql = "DELETE FROM sensors WHERE id = ?";
                    db.query(deleteSensorSql, [sensorId], (err) => {
                        if (err) return res.status(500).json({ error: "Erro ao eliminar o sensor.", details: err });

                        // Se tudo correr bem
                        return res.status(200).json({ success: "Sensor e todas as referências eliminadas com sucesso." });
                    });
                });
            });
        });
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
