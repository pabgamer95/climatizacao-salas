  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Link } from 'react-router-dom'; // Para manter a navegação
  import './css/sensors.css';

  const SensorsPage = () => {
    const [sensors, setSensors] = useState([]);
    const [error, setError] = useState(null);

    // Função para buscar sensores da API
    useEffect(() => {
      const fetchSensors = async () => {
        try {
          const response = await axios.get('http://localhost:8081/sensors');
          setSensors(response.data);
        } catch (err) {
          setError('Erro ao carregar sensores.');
          console.error('Erro ao buscar sensores:', err);
        }
      };

      fetchSensors();
    }, []);

    return (
      <div>
        <header>
          <nav className="navBar">
            <h1 className="nomeApp">AMBIENTRACK</h1>
            <Link to="/admin" className="hiperLinks">UTILIZADORES</Link>
            <Link to="#" className="hiperLinks">SENSORES</Link>
            <a href="#" className="hiperLinks">ALERTAS</a>
          </nav>
        </header>

        <h1 className="txt1">Lista de Sensores</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <table className="tabela1">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Localização</th>
              </tr>
            </thead>
            <tbody>
              {sensors.length > 0 ? (
                sensors.map((sensor) => (
                  <tr key={sensor.id}>
                    <td>{sensor.nome}</td>
                    <td>{sensor.localizacao}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">A carregar sensores...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default SensorsPage;
