import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, getAuthToken, removeAuthToken } from '../components/Auth';
import useUsers from '../Backend/users'

const AuthContext = createContext();

/* const users = [
  { email: "admin@example.com", role: "admin", password: "admin123" },
  { email: "client@example.com", role: "client", password: "client123" },
  { email: "technician@example.com", role: "technician", password: "tech123" },
]; */

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { data: users} = useUsers(); // Obtendo usuários da API
  const [user, setUser] = useState(null);

  // Restaurar o utilizador logado com base no token no carregamento
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const foundUser = users.find(u => u.email === token.email && u.role === token.role);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [users]);

  const login = (email) => {
    const foundUser = users.find(u => u.email === email );
    if (foundUser) {
      setUser(foundUser);
     /*  setAuthToken(foundUser.email, foundUser.role); // Define o token com email e role */
    } else {
      throw new Error("Utilizador não encontrado");
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}