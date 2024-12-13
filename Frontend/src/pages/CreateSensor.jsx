import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateSensor = () => {
    const [nome, setNome] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [estado, setEstado] = useState('Inativo');
    const [idRead, setIdRead] = useState('');
    const [idConfig, setIdConfig] = useState('');
    const [idModel, setIdModel] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const id = Date.now(); 

        axios
            .post('http://localhost:8081/sensors', {
                id: id,
                nome: nome,
                localizacao: localizacao,
                estado: estado,
                id_read: idRead,
                id_config: idConfig,
                id_model: idModel
            })
            .then(() => {
                console.log('Sensor registrado com sucesso!');
                navigate('/admin/sensors'); 
            })
            .catch((error) => {
                console.error('Erro ao registrar o sensor:', error);
                console.log('Erro no registro do sensor.');
            });
    };
    
    const handleGoBack = () => {
        navigate('/admin/sensors');
    };

    return (
        <div style={styles.container}>
            
            <button onClick={handleGoBack} style={styles.backButton}>
                Voltar
            </button>

            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Criar Sensor</h2>

                <label htmlFor="nome">Nome do Sensor:</label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="localizacao">Localização:</label>
                <input
                    type="text"
                    id="localizacao"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="estado">Estado:</label>
                <select
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    style={styles.input}
                >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Danificado">Danificado</option>
                </select>

                <label htmlFor="idRead">ID do Leitura:</label>
                <input
                    type="number"
                    id="idRead"
                    value={idRead}
                    onChange={(e) => setIdRead(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="idConfig">ID da Configuração:</label>
                <input
                    type="number"
                    id="idConfig"
                    value={idConfig}
                    onChange={(e) => setIdConfig(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="idModel">ID do Modelo:</label>
                <input
                    type="number"
                    id="idModel"
                    value={idModel}
                    onChange={(e) => setIdModel(e.target.value)}
                    required
                    style={styles.input}
                />

                <input type="submit" value="Criar Sensor" style={styles.button} />
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        flexDirection: 'column',
        position: 'relative',
    },
    form: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        backgroundColor: '#5cb85c',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
    },
    backButton: {
        position: 'fixed',
        top: '20px',
        left: '20px',
        backgroundColor: '#5cb85c',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default CreateSensor;
