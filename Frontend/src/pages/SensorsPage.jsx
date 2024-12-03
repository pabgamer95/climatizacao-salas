import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './css/admin.css';

const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [sensorName, setSensorName] = useState('');
  const [sensorLocation, setSensorLocation] = useState('');
  const [sensorStatus, setSensorStatus] = useState('');
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

  // Função para editar um sensor
  const handleEdit = (sensor) => {
    setEditId(sensor.id);
    setSensorName(sensor.nome);
    setSensorLocation(sensor.localizacao);
    setSensorStatus(sensor.estado);
  };

  // Função para atualizar o sensor
  const handleUpdate = async () => {
    if (!sensorName.trim() || !sensorLocation.trim() || !sensorStatus.trim()) {
      alert("Todos os campos são obrigatórios para a atualização.");
      return;
    }

    const updatedSensor = {
      nome: sensorName,
      localizacao: sensorLocation,
      estado: sensorStatus,
    };

    try {
      console.log('Enviando dados para atualizar:', updatedSensor);

      // Verificando a URL antes de enviar
      const url = `http://localhost:8081/sensors/${editId}`;
      console.log('URL de atualização:', url);

      const response = await axios.put(url, updatedSensor);
      console.log('Resposta da atualização:', response.data);

      // Atualizando a lista de sensores
      const updatedSensors = sensors.map(sensor =>
        sensor.id === editId ? { ...sensor, ...updatedSensor } : sensor
      );
      setSensors(updatedSensors);
      setEditId(null); // Limpa o estado de edição após a atualização
    } catch (err) {
      console.error("Erro ao atualizar o sensor:", err);
      alert("Erro ao atualizar o sensor. Verifique os logs para mais detalhes.");
    }
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

  return (
    <div>
      <header>
        <nav className="navBar">
          <h1 className="nomeApp">AMBIENTRACK</h1>
          <Link to="/admin" className="hiperLinks">UTILIZADORES</Link>
          <Link to="/sensors" className="hiperLinks">SENSORES</Link>
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
                        <input
                          type="text"
                          value={sensorStatus}
                          onChange={e => setSensorStatus(e.target.value)}
                        />
                      </td>
                      <td>
                        <button className="btnEditar" onClick={handleUpdate}>Atualizar</button>
                        <button className="btnEliminar" onClick={() => handleDelete(sensor.id)}>Excluir</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{sensor.nome}</td>
                      <td>{sensor.localizacao}</td>
                      <td>{sensor.estado}</td>
                      <td className="btnAcao">
                        <button className="btnEditar" onClick={() => handleEdit(sensor)}>Editar</button>
                        <button className="btnEliminar" onClick={() => handleDelete(sensor.id)}>Excluir</button>
                        <button className='btnEditar'>Info</button>
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
      </div>
    </div>
  );
};

export default SensorsPage;
