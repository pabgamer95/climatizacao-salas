import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const users = [
    { email: "admin@example.com", role: "admin", password: "admin123" },
    { email: "client@example.com", role: "client", password: "client123" },
    { email: "technician@example.com", role: "technician", password: "tech123" },
  ];
  

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error("Utilizador não encontrado");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

