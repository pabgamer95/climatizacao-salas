import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import AdminPage from './pages/AdminPage';
import ClientPage from './pages/ClientPage';
import TechnicianPage from './pages/TechnicianPage';
import PrivateRoute from './components/PrivateRoute';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    /* const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://api.example.com/posts');
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); */


  /* const [data, setData] = useState();
  console.log(data)

  useEffect(()=> {
    fetch('http://localhost:8081/users')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, []) */


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
