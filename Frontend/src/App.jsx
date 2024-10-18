import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import AdminPage from './pages/AdminPage';
import ClientPage from './pages/ClientPage';
import TechnicianPage from './pages/TechnicianPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
 
  return (
    
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Rota protegida para Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminPage />
              </PrivateRoute>
            }
          />

          {/* Rota protegida para Cliente */}
          <Route
            path="/client"
            element={
              <PrivateRoute role="client">
                <ClientPage />
              </PrivateRoute>
            }
          />

          {/* Rota protegida para Técnico */}
          <Route
            path="/technician"
            element={
              <PrivateRoute role="technician">
                <TechnicianPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
