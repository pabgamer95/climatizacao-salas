import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/sensors.css';

const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [error, setError] = useState(null);

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
          <a href="#" className="hiperLinks">UTILIZADORES</a>
          <a href="#" className="hiperLinks">SENSORES</a>
          <a href="#" className="hiperLinks">ALERTAS</a>
        </nav>
      </header>

      <h1 className="txt1">Lista de Sensores</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Tabela para exibir os sensores */}
      <table className="tabela1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Localização</th> {/* Exemplo de coluna adicional */}
            <th>Status</th> {/* Exemplo de coluna adicional */}
          </tr>
        </thead>
        <tbody>
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <tr key={sensor.id}>
                <th>{sensor.id}</th>
                <th>{sensor.nome}</th>
                <th>{sensor.localizacao}</th> {/* Aqui você pode adaptar com os dados reais que sua API retorna */}
                <th>{sensor.estado}</th> {/* Aqui você pode adaptar com os dados reais que sua API retorna */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Carregando sensores...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SensorsPage;
