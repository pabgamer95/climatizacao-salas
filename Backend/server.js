const express = require('express')
const cron = require('node-cron');
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

app.get('/registo', (req, res) => {

    const sql = `SELECT registo.*,
                 sensors.nome AS sensor,
                 sensors.localizacao AS location
                 FROM registo
                 LEFT JOIN sensors ON registo.id_sensor = sensors.id;`;

    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar o registo.", details: err });
        return res.json(data); // Retorna todos os utilizadores com a Role
    });
});

app.get('/registo/:id', (req, res) => {

    const sql = `SELECT registo.*,
                 sensors.nome AS sensor,
                 sensors.localizacao AS location
                 FROM registo
                 LEFT JOIN sensors ON registo.id_sensor = sensors.id
                 WHERE registo.id_sensor = ?;`;

    const sensorId = req.params.id;

    db.query(sql, [sensorId],(err, data) => {
        if (err) return res.json({ error: "Erro ao consultar o registo.", details: err });
        return res.json(data); // Retorna todos os utilizadores com a Role
    });
});

app.get('/warning', (req, res) => {

    const sql = `SELECT warning.*,
                 sensors.nome AS sensor,
                 sensors.localizacao AS location
                 FROM warning
                 LEFT JOIN sensors ON warning.id_sensor = sensors.id`;

    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Erro ao consultar o registo.", details: err });
        return res.json(data); // Retorna todos os utilizadores com a Role
    });
});

app.get('/sensors', (req, res) => {
    const sql = `SELECT sensors.*, 
                 read_sensors.temperatura_atual AS temp_atual, 
                 read_sensors.humidade_atual AS hum_atual 
                 FROM sensors
                 LEFT JOIN read_sensors ON sensors.id_read = read_sensors.id_read;`;
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

        const sensor = data[0];
        return res.json(sensor);
    });
});

app.post('/sensors', (req, res) => {
    const { nome, localizacao, nome_modelo, fabricante } = req.body;
    console.log(req.body)

    // 1. Inserir a referência na tabela 'read_sensors'
    const insertReadSensorsSql = "INSERT INTO read_sensors (temperatura_atual, humidade_atual) VALUES (?, ?)";
    db.query(insertReadSensorsSql, ["19.5", "50"], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao inserir na tabela read_sensors.", details: err });
        }

        const readId = result.insertId; // O id da entrada criada em 'read_sensors'
        console.log(readId);

        // 2. Inserir a referência na tabela 'config_sensor'
        const insertConfigSensorSql = "INSERT INTO config_sensor (temperatura_max, temperatura_min, humidade_max, humidade_min) VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT);";
        db.query(insertConfigSensorSql, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao inserir na tabela config_sensor.", details: err });
            }

            const configId = result.insertId; // O id da entrada criada em 'config_sensor'
            console.log(configId);

            // 3. Inserir as informações na tabela 'sensor_models'
            const insertSensorModelSql = "INSERT INTO sensor_models (nome_modelo, fabricante) VALUES (?, ?)";
            db.query(insertSensorModelSql, [nome_modelo, fabricante], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao inserir na tabela sensor_models.", details: err });
                }

                const modelId = result.insertId; // O id da entrada criada em 'sensor_models'
                console.log(modelId);

                // 4. Inserir na tabela 'sensors' com os ids criados acima
                const insertSensorSql = "INSERT INTO sensors (nome, localizacao, id_read, id_config, id_model) VALUES (?, ?, ?, ?, ?)";
                db.query(insertSensorSql, [nome, localizacao, readId, configId, modelId], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Erro ao inserir o sensor na tabela sensors.", details: err });
                    }

                    const sensorId = result.insertId; // O id do sensor criado
                    console.log(sensorId);

                    // 5. Retornar sucesso
                    return res.status(200).json({ message: "Sensor criado com sucesso!", sensorId });
                });
            });
        });
    });
});

app.put('/sensors/:id', (req, res) => {
    console.log("Atualizando sensor com ID:", req.params.id); // Debug
    console.log("Dados recebidos para atualização:", req.body); // Debug

    const sensorId = req.params.id;

    // Atualizar a tabela `config_sensor`
    const configSql = `
        UPDATE config_sensor 
        SET temperatura_min = ?, temperatura_max = ?, humidade_min = ?, humidade_max = ? 
        WHERE id_config = (
            SELECT id_config FROM sensors WHERE id = ?
        )
    `;

    const configValues = [
        req.body.temp_min,
        req.body.temp_max,
        req.body.hum_min,
        req.body.hum_max,
        sensorId
    ];

    db.query(configSql, configValues, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar config_sensor:", err); // Debugging error
            return res.status(500).json({ error: "Erro ao atualizar configurações do sensor", details: err });
        }

        // Atualizar a tabela `sensors` (se necessário)
        const sensorSql = `
            UPDATE sensors 
            SET nome = ?, localizacao = ?, estado = ? 
            WHERE id = ?;
        `;

        const sensorValues = [
            req.body.nome,
            req.body.localizacao,
            req.body.estado,
            sensorId
        ];

        db.query(sensorSql, sensorValues, (err, result) => {
            if (err) {
                console.error("Erro ao atualizar tabela sensors:", err); // Debugging error
                return res.status(500).json({ error: "Erro ao atualizar sensor", details: err });
            }

            console.log("Sensor atualizado com sucesso:", result);
            return res.status(200).json({ success: "Sensor atualizado com sucesso." });
        });
    });
});


app.delete('/sensors/:id', (req, res) => {
    const sensorId = req.params.id;

    // 1. Eliminar o sensor da tabela sensors (filha)
    const deleteSensorSql = "DELETE FROM sensors WHERE id = ?";
    db.query(deleteSensorSql, [sensorId], (err) => {
        if (err) return res.status(500).json({ error: "Erro ao eliminar o sensor.", details: err });

        // 2. Eliminar as referências na tabela sensor_models (pai)
        const deleteSensorModelSql = "DELETE FROM sensor_models WHERE id_model = ?";
        db.query(deleteSensorModelSql, [sensorId], (err) => {
            if (err) return res.status(500).json({ error: "Erro ao eliminar referências na tabela sensor_model.", details: err });

            // 3. Eliminar as referências na tabela config_sensor (pai)
            const deleteConfigSensorSql = "DELETE FROM config_sensor WHERE id_config = ?";
            db.query(deleteConfigSensorSql, [sensorId], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao eliminar referências na tabela config_sensor.", details: err });

                // 4. Eliminar as referências na tabela read_sensors (pai)
                const deleteReadSensorsSql = "DELETE FROM read_sensors WHERE id_read = ?";
                db.query(deleteReadSensorsSql, [sensorId], (err) => {
                    if (err) return res.status(500).json({ error: "Erro ao eliminar referências na tabela read_sensors.", details: err });

                });
            });
        });
    });
});

const verificarLimites = (sensor) => {
    const { temp_atual, hum_atual } = sensor;
    let mensagem = '';

    // Verificando limites de temperatura
    if (temp_atual > sensor.temp_max) {
        mensagem += `Temperatura atual ${temp_atual} excedeu o limite máximo ${sensor.temp_max}. `;
    } else if (temp_atual < sensor.temp_min) {
        mensagem += `Temperatura atual ${temp_atual} abaixo do limite mínimo ${sensor.temp_min}. `;
    }

    // Verificando limites de humidade
    if (hum_atual > sensor.hum_max) {
        mensagem += `Humidade atual ${hum_atual} excedeu o limite máximo ${sensor.hum_max}. `;
    } else if (hum_atual < sensor.hum_min) {
        mensagem += `Humidade atual ${hum_atual} abaixo do limite mínimo ${sensor.hum_min}. `;
    }

    return mensagem;
};

// Dentro do código de inserção de registros automáticos (exemplo no cron)
cron.schedule('*/10 * * * *', async () => {
       console.log('Iniciando registo automático dos sensores...');

    const query = `
        SELECT sensors.id, 
               read_sensors.temperatura_atual AS temp_atual, 
               read_sensors.humidade_atual AS hum_atual,
               config_sensor.temperatura_max AS temp_max,
               config_sensor.temperatura_min AS temp_min,
               config_sensor.humidade_max AS hum_max,
               config_sensor.humidade_min AS hum_min
        FROM sensors
        LEFT JOIN read_sensors ON sensors.id_read = read_sensors.id_read
        LEFT JOIN config_sensor ON sensors.id_config = config_sensor.id_config;
    `;

    db.query(query, (err, sensors) => {
        if (err) {
            console.error('Erro ao buscar dados dos sensores:', err);
            return;
        }

        // Inserir os registos na tabela `registo` e verificar limites
        sensors.forEach((sensor) => {
            const limiteMensagem = verificarLimites(sensor);

            if (limiteMensagem) {
                console.log(`Alerta para o sensor ID ${sensor.id}: ${limiteMensagem}`);

                // Inserir na tabela warning com a mensagem e hora atual
                const insertWarningQuery = `
                    INSERT INTO warning (mensagem, data_warning, id_sensor)
                    VALUES (?, NOW(), ?);
                `;

                db.query(insertWarningQuery, [limiteMensagem, sensor.id], (err) => {
                    if (err) {
                        console.error(`Erro ao inserir alerta na tabela warning: ${err}`);
                    } else {
                        console.log(`Alerta inserido na tabela warning para o sensor ID ${sensor.id}.`);
                    }
                });
            } else {
                console.log(`Nenhum alerta do sensor: ${sensor.id}`)
            }
            
        });
    });
});

// Tarefa automática para registar sensores a cada 5 minutos
cron.schedule('*/10 * * * *', async () => {
       console.log('Iniciando registo automático dos sensores...');
  
    const query = `
      SELECT sensors.id, read_sensors.temperatura_atual AS temp_atual, 
             read_sensors.humidade_atual AS hum_atual 
      FROM sensors
      LEFT JOIN read_sensors ON sensors.id_read = read_sensors.id_read;
    `;
  
    db.query(query, (err, sensors) => {
      if (err) {
        console.error('Erro ao buscar dados dos sensores:', err);
        return;
      }
  
      // Inserir os registos na tabela `registo`
      sensors.forEach((sensor) => {
        const insertQuery = `
          INSERT INTO registo (temperatura, humidade, id_sensor)
          VALUES (?, ?, ?);
        `;
  
        db.query(insertQuery, [sensor.temp_atual, sensor.hum_atual, sensor.id], (err) => {
          if (err) {
            console.error(`Erro ao registar sensor ID ${sensor.id}:`, err);
          } else {
            console.log(`Registo do sensor ID ${sensor.id} concluído.`);
          }
        });
      });
    });
  });
  

app.listen(8081, () => {
    console.log("Servidor ouvindo na porta 8081");
});