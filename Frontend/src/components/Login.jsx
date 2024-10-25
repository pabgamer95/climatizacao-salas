
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUsers from "../getBackend/users";
import '../index.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Defina o array de utilizadores aqui com senhas
  //const { data: users, loading} = useUsers();

 // if (loading) return <p>Loading...</p>;
   const users = [
    { email: "admin@example.com", role: "admin", password: "admin123" },
    { email: "client@example.com", role: "client", password: "client123" },
    { email: "technician@example.com", role: "technician", password: "tech123" },
  ]; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Tentar fazer login com o email e a senha
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        login(email); // Chama o método de login do contexto
        // Redirecionar com base no cargo do utilizador
        if (foundUser.role === 'admin') {
          navigate("/admin");
          
        } else if (foundUser.role === 'client') {
          navigate("/client");
        } else if (foundUser.role === 'technician') {
          navigate("/technician");
        }
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (err) {
      setError("O seu Login Falhou. Verifique as suas credenciais.");
    }
  };

  return (
    <body className="login">
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
         </div>
        
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input 
             type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
           />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Entrar
          </button>
       </form>
      </div>
    </body>
  );
}