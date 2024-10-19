// src/compoents/Auth.jsx
import Cookies from 'js-cookie';

// Define o token no cookie
export const setAuthToken = (token) => {
    Cookies.set('authToken', token, { expires: 7 }); // Token expira em 7 dias
};

// Obtém o token do cookie
export const getAuthToken = () => {
    return Cookies.get('authToken');
};

// Remove o token do cookie (usado no logout)
export const removeAuthToken = () => {
    Cookies.remove('authToken');
};
