// src/components/handleSubmit.js
import axios from 'axios';

export const handleSubmit = async (userData, setSuccess, setError, setUsername, setEmail, setPassword, setRole) => {
    try {
        
        console.log("Dados enviados:", userData);
        const response = await axios.post('http://localhost:8081/users', userData); // Ajuste a URL conforme necessário

        if (response.status === 201) {
            setSuccess(true);
            setError(null);
            // Limpar o formulário
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
        }
    } catch (error) {
        console.error("Erro ao envia dados:", error)
        setError(error.response?.data?.message || 'Erro ao registrar');
        setSuccess(false);
    }
};
