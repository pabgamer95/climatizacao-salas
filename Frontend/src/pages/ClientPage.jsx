import React from 'react';
import useSensors from '../Backend/sensors';
import { Link } from 'react-router-dom'; // Adicionei o useNavigate para redirecionamento
import './css/sensors.css';

const SensorsPage = () => {
  const { data, error} = useSensors([]);


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

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe erro se houver */}

      <div>
        <table className="tabela1">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Localização</th>
              <th>Temperatura Atual</th>
              <th>Humidade Atual</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((sensor) => (
                <tr key={sensor.id}>
                  <td>{sensor.nome}</td>
                  <td>{sensor.localizacao}</td>
                  <td>{sensor.temp_atual}ºC</td> {/* Exibindo a Temperatura Atual */}
                  <td>{sensor.hum_atual}%</td>  {/* Exibindo a Humidade Atual */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">A carregar sensores...</td> {/* Exibe quando está carregando */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorsPage;
