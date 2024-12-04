import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Adicionei o useNavigate para redirecionamento
import './css/sensors.css';
import Cookies from 'js-cookie'; // Importando o Cookies

const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [sensorName, setSensorName] = useState('');
  const [sensorLocation, setSensorLocation] = useState('');
  const [sensorStatus, setSensorStatus] = useState('');
  const [error, setError] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const navigate = useNavigate(); // Inicializa o useNavigate

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
    setSelectedSensor(null);
    setIsModalOpen(false);
  };

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
          <p><strong>Temperatura Máxima:</strong> {sensor.temp_max}ºC</p>
          <p><strong>Temperatura Mínima:</strong> {sensor.temp_min}ºC</p>
          <p><strong>Humidade Máxima:</strong> {sensor.hum_max}%</p>
          <p><strong>Humidade Mínima:</strong> {sensor.hum_min}%</p>
          <p><strong>Temperatura Atual:</strong> {sensor.temp_atual}ºC</p>
          <p><strong>Humidade Atual:</strong> {sensor.hum_atual}%</p>
          <button className="btnFechar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  };


  // Função para editar um sensor
  const handleEdit = (id) => {
    axios
      .get('http://localhost:8081/sensors/' + id)
      .then((res) => {
        setSensorName(res.data.nome);
        setSensorLocation(res.data.localizacao);
        setSensorStatus(res.data.estado);
      })
      .catch((er) => console.log(er));
    setEditId(id);
  };

  // Função para atualizar o sensor
  const handleUpdate = () => {
    if (!sensorName.trim() || !sensorLocation.trim() || !sensorStatus.trim()) {
      alert("Todos os campos são obrigatórios para a atualização.");
      return;
    }

    const updatedSensor = {
      nome: sensorName,
      localizacao: sensorLocation,
      estado: sensorStatus,
    };

    axios
      .put(`http://localhost:8081/sensors/${editId}`, updatedSensor)
      .then(() => {
        return axios.get(`http://localhost:8081/sensors/${editId}`);
      })
      .then((res) => {
        const updatedSensorFromBackend = res.data;
        const updatedSensors = sensors.map((sensor) =>
          sensor.id === editId ? updatedSensorFromBackend : sensor
        );
        setSensors(updatedSensors);
        setEditId(-1);
      })
      .catch((err) => {
        console.error("Erro ao atualizar o sensor:", err);
        alert("Erro ao atualizar o sensor. Verifique os logs para mais detalhes.");
      });
  };

  // Função para excluir um sensor
  const handleDelete = async (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este sensor?')) {
      try {
        console.log('Enviando requisição DELETE para:', `http://localhost:8081/sensors/${id}`);

        const response = await axios.delete(`http://localhost:8081/sensors/${id}`);
        console.log('Resposta da exclusão:', response.data);

        const updatedSensors = sensors.filter(sensor => sensor.id !== id);
        setSensors(updatedSensors);
      } catch (err) {
        console.error("Erro ao excluir o sensor:", err);
        alert("Erro ao excluir o sensor. Verifique os logs para mais detalhes.");
      }
    }
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
          <Link to="/admin" className="hiperLinks">UTILIZADORES</Link>
          <Link to="#" className="hiperLinks">SENSORES</Link>
          <a href="#" className="hiperLinks">ALERTAS</a>
          <button className="btnLogout" onClick={handleLogout}>Sair</button>
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
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sensors.length > 0 ? (
              sensors.map((sensor) => (
                <tr key={sensor.id}>
                  {editId === sensor.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={sensorName}
                          onChange={e => setSensorName(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={sensorLocation}
                          onChange={e => setSensorLocation(e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={sensorStatus || ''}
                          onChange={(e) => setSensorStatus(e.target.value)}
                        >
                          <option value="Danificado">Danificado</option>
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                        </select>
                      </td>
                      <td>
                        <button className="btnEditar" onClick={handleUpdate}>Atualizar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{sensor.nome}</td>
                      <td>{sensor.localizacao}</td>
                      <td>{sensor.estado}</td>
                      <td className="btnAcao">
                        <button className="btnEditar" onClick={() => handleEdit(sensor.id)}>Editar</button>
                        <button className="btnEliminar" onClick={() => handleDelete(sensor.id)}>Excluir</button>
                        <button className='btnInfo' onClick={() => handleInfo(sensor.id)}>Info</button>
                      </td>
                    </>
                  )}
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

      </div>
    </div>
  );
};

export default SensorsPage;
