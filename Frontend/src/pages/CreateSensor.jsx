import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/create.css';

export default function CreateSensor() {
    const [nome, setNome] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [modelo, setModelo] = useState('');
    const [fabricante, setFabricante] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8081/sensors', {
                nome: nome,
                localizacao: localizacao,
                nome_modelo: modelo,
                fabricante: fabricante
            })
            .then(() => {
                console.log('Sensor registrado com sucesso!');
                navigate(-1); 
            })
            .catch((error) => {
                console.error('Erro ao registrar o sensor:', error);
                console.log('Erro no registro do sensor.');
            });
    };
    
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div class="create">
            
            <button onClick={handleGoBack} class="backButton">
                Voltar
            </button>

            <form onSubmit={handleSubmit} class="form">
                <h3 class="title">Criar Sensor</h3>

                <label htmlFor="nome">Nome do Sensor:</label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    class="input"
                />

                <label htmlFor="localizacao">Localização:</label>
                <input
                    type="text"
                    id="localizacao"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    required
                    class="input"
                />

                <label htmlFor="modelo">Modelo:</label>
                <input
                    type="text"
                    id="modelo"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    required
                    class="input"
                />

                <label htmlFor="fabricante">Fabricante:</label>
                <input
                    type="text"
                    id="fabricante"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                    required
                    class="input"
                />

                <input type="submit" value="Criar Sensor" class="button" />
            </form>
        </div>
    );
};

