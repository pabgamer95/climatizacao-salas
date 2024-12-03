import { useEffect ,useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUsers from "../Backend/users";
import Cookies from 'js-cookie';
import '../index.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Defina o array de utilizadores aqui com senhas
   const { data: users, loading} = useUsers();

  useEffect(() => {
    // Verificar se existe o cookie para redirecionar
    const loggedInUser = Cookies.get('loggedInUser');
    
    if (loggedInUser) {
      const { email, role } = JSON.parse(loggedInUser); // Parse do objeto do cookie
      const foundUser = users?.find(u => u.email === email);
      
      if (foundUser) {
        // Redirecionar com base na role do cookie
        if (role === 'admin') {
          navigate(`/${role}`);
        }
      }
    }
  }, [navigate, users]);

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      // Procura o usuário que corresponde ao email
      const foundUser = users.find(u => u.email === email);
  
      if (foundUser && foundUser.password === password) {
        login(email);
  
        // Usa role_name do backend em vez de role
        const userRole = foundUser.role_name.toLowerCase();
        
        // Configura o cookie com os dados do usuário
        const cookieData = {
          email: foundUser.email,
          role: userRole
        };
        
        // Define o cookie com o path correto
        Cookies.set('loggedInUser', JSON.stringify(cookieData), {
          expires: 7 / 24,
          path: '/'  // Permite acesso ao cookie em todas as rotas
        });
  
        // Redireciona baseado no role_name
        navigate(`/${userRole}`);
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

