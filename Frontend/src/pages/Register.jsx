import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/create.css';

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('3'); 

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8081/users', {nome: nome, email: email, password: password, role_id: role })
            .then(() => {
                console.log('Usuário registrado com sucesso!');
                navigate('/admin'); 
            })
            .catch((error) => {
                console.error('Erro ao registrar o usuário:', error);
                console.log('Erro no registro.');
            });
    };
    
    const handleGoBack = () => {
        navigate('/admin'); 
    };

    return (
        <div class="create">
            
            <button onClick={handleGoBack} class="backButton">
                Voltar
            </button>

            <form onSubmit={handleSubmit} class="form">
                <h3 class="title">Registo</h3>

                <label htmlFor="nome">Nome de Usuário:</label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    class="input"
                />

                <label htmlFor="email">E-mail:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    class="input"
                />

                <label htmlFor="password">Senha:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    class="input"
                />

                <label htmlFor="role">Função:</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        console.log("Role selecionado:", e.target.value); 
                    }}
                    class="input"
                >
                    <option value="3">Client</option>
                    <option value="2">Technician</option>
                    <option value="1">Admin</option>
                </select>
                
                <input type="submit" value="Criar Utilizador" class="button"/>
            </form>
        </div>
    );
};

