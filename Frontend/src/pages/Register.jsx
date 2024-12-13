import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsers from '../Backend/users';
import axios from 'axios';

const Register = () => {
    const {data} = useUsers();
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
        <div style={styles.container}>
            
            <button onClick={handleGoBack} style={styles.backButton}>
                Voltar
            </button>

            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Registro</h2>

                <label htmlFor="nome">Nome de Usuário:</label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="email">E-mail:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="password">Senha:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="role">Função:</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        console.log("Role selecionado:", e.target.value); 
                    }}
                    style={styles.input}
                >
                    <option value="3">Client</option>
                    <option value="2">Technician</option>
                    <option value="1">Admin</option>
                </select>
                
                <input type="submit" value="Criar Utilizador" style={styles.button} />
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

export default Register;
