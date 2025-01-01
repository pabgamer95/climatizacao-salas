import React from 'react';
import useSensors from '../Backend/sensors';
import { Link, useNavigate } from 'react-router-dom'; // Adicionei o useNavigate para redirecionamento
import './css/admin.css';
import Cookies from 'js-cookie';

export default function ClientPage() {
  const navigate = useNavigate(); // Inicializa o useNavigate
  const { data, error} = useSensors([]);

  const handleLogout = () => {
    // Remover o cookie "loggedInUser"
    Cookies.remove('loggedInUser', { path: '/' });

    // Redirecionar para a página inicial
    navigate('/'); // Redireciona para a página desejada ("/")
  };

  return (
    <div>
      <header>
        <nav className="navBar">
          <h1 className="nomeApp">AMBIENTRACK</h1>
          
          <button className="btnLogout" onClick={handleLogout}>Sair</button>
        </nav>
      </header>

      <h1 className="txt">Lista de Sensores</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe erro se houver */}

      <div>
        <table className="tabela">
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
