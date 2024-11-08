// src/compoents/Auth.jsx
import Cookies from 'js-cookie';

// Define o token no cookie com a `role` do utilizador
/* export const setAuthToken = (email, role) => {
    Cookies.set('authToken', JSON.stringify({ email, role }), { expires: 1 }); // Expira em 1 dias
}; */

// Obtém o token do cookie
export const getAuthToken = () => {
    const token = Cookies.get('loggedInUser');
    return token ? JSON.parse(token) : null; // Retorna o token como um objeto
};

// Remove o token do cookie
export const removeAuthToken = () => {
    Cookies.remove('loggedInUser');
};