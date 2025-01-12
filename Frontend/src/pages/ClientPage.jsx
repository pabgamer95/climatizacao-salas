import React , { useState} from 'react';
import axios from 'axios';
import useSensors from '../Backend/sensors';
import { Link, useNavigate } from 'react-router-dom'; // Adicionei o useNavigate para redirecionamento
import './css/admin.css';
import Cookies from 'js-cookie';
import historicIcon from './icon/historico.png';

export default function ClientPage() {
  const navigate = useNavigate(); // Inicializa o useNavigate
  const { data, error} = useSensors([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isHistoricModalOpen, setIsHistoricModalOpen] = React.useState(false);

  const handleLogout = () => {
    // Remover o cookie "loggedInUser"
    Cookies.remove('loggedInUser', { path: '/' });

    // Redirecionar para a página inicial
    navigate('/'); // Redireciona para a página desejada ("/")
  };


  const handleHistoric = async (sensorId) =>{
    try {
      const response = await axios.get(`http://localhost:8081/registo/${sensorId}`); // Faz a requisição para obter o sensor pelo ID
      setSelectedSensor(response.data); // Define o sensor retornado como o sensor selecionado
      setIsHistoricModalOpen(true);
    } catch (err) {
      console.error('Erro ao buscar informações do sensor:', err);
      alert('Erro ao buscar informações do sensor.');
    }
  };

  const closeModal = () => {
    if (isHistoricModalOpen) {
      setSelectedSensor(null);
      setIsHistoricModalOpen(false);
    }
  };

  const HistoricModal = ({sensor, onClose}) => {
    if (!sensor) return null;

    return (
      <div className="modalOverlay">
        <div className="modalContentHistoric">
          <h2>Histórico de Registros</h2>
  
          <table className="tabelaRegisto">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Temperatura (ºC)</th>
                <th>Humidade (%)</th>
              </tr>
            </thead>
            <tbody>
              {sensor.map((registo) => (
                <tr key={registo.id}>
                  <td>{new Date(registo.data_registo).toLocaleDateString()}</td>
                  <td>{new Date(registo.data_registo).toLocaleTimeString()}</td>
                  <td>{registo.temperatura}ºC</td>
                  <td>{registo.humidade}%</td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <button className="btnFechar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <nav className="navBar">
          <h1 className="nomeApp">AMBIENTRACK</h1>

          <Link to="#" className="hiperLinks">
                    SENSORES
                </Link>

                <Link to="/client/warning" className="hiperLinks">
                    WARNINGS
                </Link>
          
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
              <th>Ação</th>
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
                  <img src={historicIcon} className='btnHistoric' onClick={() => handleHistoric(sensor.id)}/>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">A carregar sensores...</td> {/* Exibe quando está carregando */}
              </tr>
            )}
          </tbody>
        </table>

        {isHistoricModalOpen && (
          <HistoricModal sensor={selectedSensor} onClose={closeModal} />
        )}

      </div>
    </div>
  );
};
