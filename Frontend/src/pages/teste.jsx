import React, { useState } from 'react';
import useUsers from '../Backend/users';
import axios from 'axios';


const Register = () => {
    const {data} = useUsers();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // Default role

    const handleSubmit = (e) => {
        e.preventDefault()

        const id = data.length + 1
        axios.post('http://localhost:8081/users', {id: id, name: nome, email: email, password: password, role: role})
        
    };

    return (
        <div style={styles.container}>
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
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.input}
                >
                    <option value="client">Cliente</option>
                    <option value="technician">Técnico</option>
                    <option value="admin">Admin</option>
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
};


export default Register;
