import React, { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import useSensors from '../Backend/sensors';
import { Link, useNavigate } from 'react-router-dom'; // Adicionei o useNavigate para redirecionamento
import './css/admin.css';
import Cookies from 'js-cookie'; // Importando o Cookies
import historicIcon from './icon/historico.png';

export default function SensorsPage() {
  const { data, error, setData } = useSensors([]);
  const [editId, setEditId] = useState(-1);
  const [sensorName, setSensorName] = useState('');
  const [sensorLocation, setSensorLocation] = useState('');
  const [sensorStatus, setSensorStatus] = useState('');
  const [sensorTempMax, setSensorTempMax] = useState('');
  const [sensorTempMin, setSensorTempMin] = useState('');
  const [sensorHumMax, setSensorHumMax] = useState('');
  const [sensorHumMin, setSensorHumMin] = useState('');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isHistoricModalOpen, setIsHistoricModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [sensorTypeStatus, setSensorTypeStatus] = useState('all');

  // Referências para todos os campos de entrada
  const nameRef = useRef();
  const locationRef = useRef();
  const tempMaxRef = useRef();
  const tempMinRef = useRef();
  const humMaxRef = useRef();
  const humMinRef = useRef();

  useEffect(() => {
    // Manter o foco no campo de nome quando o sensor mudar
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, [sensorName]);

  useEffect(() => {
    // Manter o foco no campo de nome quando o sensor mudar
    if (locationRef.current) {
      locationRef.current.focus();
    }
  }, [sensorLocation]);

  useEffect(() => {
    // Manter o foco no campo de nome quando o sensor mudar
    if (tempMinRef.current) {
      tempMinRef.current.focus();
    }
  }, [sensorTempMin]);

  useEffect(() => {
    // Manter o foco no campo de nome quando o sensor mudar
    if (tempMaxRef.current) {
      tempMaxRef.current.focus();
    }
  }, [sensorTempMax]);

  useEffect(() => {
    // Manter o foco no campo de nome quando o sensor mudar
    if (humMinRef.current) {
      humMinRef.current.focus();
    }
  }, [sensorHumMin]);

  useEffect(() => {
    // Manter o foco no campo de nome quando o sensor mudar
    if (humMaxRef.current) {
      humMaxRef.current.focus();
    }
  }, [sensorHumMax]);

  const navigate = useNavigate(); // Inicializa o useNavigate


// Função para editar um sensor
const handleEdit = async (sensorId) => {
  try {
    const response = await axios.get(`http://localhost:8081/sensors/${sensorId}`); // Faz a requisição para obter o sensor pelo ID

    setSensorName(response.data.nome);
    setSensorLocation(response.data.localizacao);
    setSensorStatus(response.data.estado);
    setSensorTempMax(response.data.temp_max);
    setSensorTempMin(response.data.temp_min);
    setSensorHumMax(response.data.hum_max);
    setSensorHumMin(response.data.hum_min);
    setSelectedSensor(response.data); // Define o sensor retornado como o sensor selecionado
    setIsEditModalOpen(true);
    setEditId(sensorId);

  } catch (err) {
    console.error('Erro ao buscar informações do sensor:', err);
    alert('Erro ao buscar informações do sensor.');
  }
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

  const handleInfo = async (sensorId) => {
    try {
      const response = await axios.get(`http://localhost:8081/sensors/${sensorId}`); // Faz a requisição para obter o sensor pelo ID
      setSelectedSensor(response.data); // Define o sensor retornado como o sensor selecionado
      setIsModalOpen(true);
    } catch (err) {
      console.error('Erro ao buscar informações do sensor:', err);
      alert('Erro ao buscar informações do sensor.');
    }
  };

  const closeModal = () => {
    if (isModalOpen) {
      setSelectedSensor(null);
      setIsModalOpen(false);
    }
    if (isHistoricModalOpen) {
      setSelectedSensor(null);
      setIsHistoricModalOpen(false);
    }
    if(isEditModalOpen){
      setSelectedSensor(null);
      setIsEditModalOpen(false);
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

  const SensorModal = ({ sensor, onClose }) => {
    if (!sensor) return null;
  
    return (
      <div className="modalOverlay">
        <div className="modalContent">
          <h2>Informações do Sensor</h2>
          <p><strong>Modelo:</strong> {sensor.modelo_sensor}</p>
          <p><strong>Fabricante:</strong> {sensor.fabricante_sensor}</p>
          <p><strong>Localização:</strong> {sensor.localizacao}</p>
          <p><strong>Status:</strong> {sensor.estado}</p>
          <p><strong>Temperatura Mínima:</strong> {sensor.temp_min}ºC</p>
          <p><strong>Temperatura Máxima:</strong> {sensor.temp_max}ºC</p>
          <p><strong>Humidade Mínima:</strong> {sensor.hum_min}%</p>
          <p><strong>Humidade Máxima:</strong> {sensor.hum_max}%</p>
          <p><strong>Temperatura Atual:</strong> {sensor.temp_atual}ºC</p>
          <p><strong>Humidade Atual:</strong> {sensor.hum_atual}%</p>
          <button className="btnFechar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  };

  const EditModal = ({sensor, onClose}) => {
    if (!sensor) return null;

    

    const handleInputChange = (setter) => (e) => setter(e.target.value);

    return(
      <div className='modalOverlay'>
        <div className='modalContentEdit'>
          <h2>Editar Sensor</h2>
          <div className='items edit'>
            <div className='item'>
              <p><strong>Nome:</strong></p>
              <input type="text" value={sensorName} onChange={handleInputChange(setSensorName)} ref={nameRef}/>
            </div>
            <div className='item'>
              <p><strong>Localização:</strong></p>           
              <input type="text" value={sensorLocation} onChange={handleInputChange(setSensorLocation)} ref={locationRef}/>
            </div>            
            <div className='item'>
              <p><strong>Status:</strong></p>
              <select value={sensorStatus || ''} onChange={handleInputChange(setSensorStatus)} >
                <option value="Danificado">Danificado</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>            
            </div>
          </div>
          <div className='items'>
            <div className='item'>
              <p><strong>Temperatura Minima:</strong></p>
              <input type="number" value={sensorTempMin} onChange={handleInputChange(setSensorTempMin)} ref={tempMinRef}/>
            </div>
            <div className='item'>
              <p><strong>Temperatura Máxima:</strong></p>
              <input type="number" value={sensorTempMax} onChange={handleInputChange(setSensorTempMax)} ref={tempMaxRef} />
            </div>
          </div>
          <div className='items'>
            <div className='item'>
              <p><strong>Humidade Minima:</strong></p>
              <input type="number" value={sensorHumMin} onChange={handleInputChange(setSensorHumMin)} ref={humMinRef}/>
            </div>
            <div className='item'>
              <p><strong>Temperatura Máxima:</strong></p>
              <input type="number" value={sensorHumMax} onChange={handleInputChange(setSensorHumMax)} ref={humMaxRef}/>
            </div>
          </div>
          <div>
            <button className="btnEditar" onClick={handleUpdate}>Atualizar</button>
            <button className="btnFechar" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  };

  // Função para atualizar o sensor
  const handleUpdate = () => {
    if (!sensorName.trim() || !sensorLocation.trim() || !sensorStatus.trim() || !sensorTempMin || !sensorTempMax || !sensorHumMin|| !sensorHumMax) {
      alert("Todos os campos são obrigatórios para a atualização.");
      return;
    }

    const updatedSensor = {
      nome: sensorName,
      localizacao: sensorLocation,
      estado: sensorStatus,
      temp_min:sensorTempMin,
      temp_max:sensorTempMax,
      hum_min:sensorHumMin,
      hum_max:sensorHumMax
    };

    axios
      .put(`http://localhost:8081/sensors/${editId}`, updatedSensor)
      .then(() => {
        // Fazer uma nova requisição para obter os dados atualizados do sensor
        return axios.get(`http://localhost:8081/sensors/${editId}`);
      })
      .then((res) => {
        const updatedSensorFromBackend = res.data;
        const updatedSensors = data.map((sensor) =>
          sensor.id === editId ? updatedSensorFromBackend : sensor
        );
        setData(updatedSensors);
        setEditId(-1);
        setSelectedSensor(null);
        setIsEditModalOpen(false);
      })
      .catch((err) => {
        console.error("Erro ao atualizar o sensor:", err);
        alert("Erro ao atualizar o sensor. Verifique os logs para mais detalhes.");
      });
  };

  // Função para excluir um sensor
  const handleDelete = (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este sensor?')) {
      axios
        .delete(`http://localhost:8081/sensors/${id}`)
        .then(() => {
          const updatedData = data.filter((sensor) => sensor.id !== id);
          setData(updatedData);
        })
        .catch((er) => {
          console.error('Erro ao excluir o sensor:', er);
          alert('Erro ao excluir o sensor.');
        });
    }
  };

  const handleSensorTypeStatusChange = (e) => {
    setSensorTypeStatus(e.target.value);
  };

  // Função para fazer o logout
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
          <Link to="#" className="hiperLinks">SENSORES</Link>
          
          <button className="btnLogout" onClick={handleLogout}>Sair</button>
        </nav>
      </header>

      <h1 className="txt">Lista de Sensores</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>

        <div class="contents">
          <Link to="/admin/sensors/createSensor">
            <button className="btnCriar">Criar Sensor</button>
          </Link>

          <div class="preferences">
            <label htmlFor="sensorTypeStatus">Mostrar Sensores:</label>
            <select id="sensorTypeStatus" value={sensorTypeStatus} onChange={handleSensorTypeStatusChange}>
              <option value="all">Todos</option>
              <option value="ativo">Ativa</option>
              <option value="inativo">Inativo</option>
              <option value="danificado">Danificado</option>
            </select>
          </div>
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Localização</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((sensor) => (
                <tr key={sensor.id}>
                  {(sensorTypeStatus === 'all') || // Exibe todos os usuários
                  (sensorTypeStatus === 'ativo' && sensor.estado === 'Ativo') || // Corrigido para 'ativo'
                  (sensorTypeStatus === 'inativo' && sensor.estado === 'Inativo') || // Corrigido para 'inativo'
                  (sensorTypeStatus === 'danificado' && sensor.estado === 'Danificado') ? ( // Corrigido para 'danificado'
                      <>
                        <td>{sensor.nome}</td>
                        <td>{sensor.localizacao}</td>
                        <td>{sensor.estado}</td>
                        <td className="btnAcao">
                          <button className="btnEditar" onClick={() => handleEdit(sensor.id)}>Editar</button>
                          <button className="btnEliminar" onClick={() => handleDelete(sensor.id)}>Excluir</button>
                          <button className='btnInfo' onClick={() => handleInfo(sensor.id)}>Info</button>
                          <img src={historicIcon} className='btnHistoric' onClick={() => handleHistoric(sensor.id)}/>
                        </td>
                      </>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">A carregar sensores...</td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <SensorModal sensor={selectedSensor} onClose={closeModal} />
        )}

        {isHistoricModalOpen && (
          <HistoricModal sensor={selectedSensor} onClose={closeModal} />
        )}

        {isEditModalOpen && (
          <EditModal sensor={selectedSensor} onClose={closeModal} />
        )}

      </div>
    </div>
  );
};
