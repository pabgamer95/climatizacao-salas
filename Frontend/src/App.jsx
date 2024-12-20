import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import AdminPage from './pages/AdminPage';
import ClientPage from './pages/ClientPage';
import TechnicianPage from './pages/TechnicianPage';
import Register from './pages/Register';
import SensorsPage from './pages/SensorsPage';
import CreateSensor from './pages/CreateSensor';
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
             // <PrivateRoute role="admin">
                <AdminPage />
              //</PrivateRoute>
            }
          />

          {/* Rota protegida para Cliente */}
          <Route
            path="/client"
            element={
             // <PrivateRoute role="client">
                <ClientPage />
              //</PrivateRoute>
            }
          />

          {/* Rota protegida para Técnico */}
          <Route
            path="/technician"
            element={
             // <PrivateRoute role="technician">
                <TechnicianPage />
              //</PrivateRoute>
            }
          />

          {/* Rota protegida para Técnico */}
          <Route
            path="/technician/createSensor"
            element={
             // <PrivateRoute role="technician">
                <CreateSensor />
              //</PrivateRoute>
            }
          />

          <Route
            path="admin/register"
            element={
             // <PrivateRoute role="technician">
                <Register />
              //</PrivateRoute>
            }
          />

          {/* Rota para a nova página de Sensores */}
          <Route path="admin/sensors" 
          element={
            <SensorsPage />
            } 
          />

          {/* Rota para a nova página de Sensores */}
          <Route path="admin/sensors/createSensor" 
          element={
            <CreateSensor />
            } 
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
