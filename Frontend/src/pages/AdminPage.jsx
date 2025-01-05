import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate aqui
import axios from 'axios';
import useUsers from '../Backend/users';
import './css/admin.css';
import Cookies from 'js-cookie'; // Importando o Cookies

export default function AdminPage() {
  const navigate = useNavigate(); // Inicializa o useNavigate
  const { data, loading, error, setData } = useUsers([]);
  const [editId, setEditID] = useState(-1);
  const [unome, usetnome] = useState('');
  const [uemail, usetmail] = useState('');
  const [role, setRole] = useState('');
  const [userType, setUserType] = useState('all');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  // Função para editar um usuário
  const handleEdit = (id) => {
    axios
      .get('http://localhost:8081/users/' + id)
      .then((res) => {
        usetnome(res.data.nome);
        usetmail(res.data.email);
        setRole(res.data.role_id);
      })
      .catch((er) => console.log(er));
    setEditID(id);
  };

  // Função para atualizar um usuário
  const handleUpdate = () => {
    if (!unome || !uemail || !role) {
      alert('Todos os campos são obrigatórios para a atualização.');
      return;
    }

    const updatedUser = {
      nome: unome,
      email: uemail,
      role_id: role,
    };

    axios
      .put(`http://localhost:8081/users/${editId}`, updatedUser)
      .then(() => {
        return axios.get(`http://localhost:8081/users/${editId}`);
      })
      .then((res) => {
        const updatedUserFromBackend = res.data;
        const updatedData = data.map((user) =>
          user.id === editId ? updatedUserFromBackend : user
        );
        setData(updatedData);
        setEditID(-1);
      })
      .catch((err) => {
        console.error('Erro ao atualizar o utilizador:', err);
      });
  };

  // Função para excluir um usuário
  const handleDelete = (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este utilizador?')) {
      axios
        .delete(`http://localhost:8081/users/${id}`)
        .then(() => {
          const updatedData = data.filter((user) => user.id !== id);
          setData(updatedData);
        })
        .catch((er) => {
          console.error('Erro ao excluir o utilizador:', er);
        });
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
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
          <Link to="/admin" className="hiperLinks">
            UTILIZADORES
          </Link>
          <Link to="/admin/sensors" className="hiperLinks">
            SENSORES
          </Link>
          
          <button className="btnLogout" onClick={handleLogout}>Sair</button>
        </nav>
      </header>

      <h1 className="txt">Lista de Utilizadores</h1>

      <div>
        <div class="contents">
          <Link to="/admin/register">
            <button className="btnCriar">Criar Utilizador</button>
          </Link>

          <div class="preferences">
            <label htmlFor="userType">Mostrar Utilizadores:</label>
            <select id="userType" value={userType} onChange={handleUserTypeChange}>
              <option value="all">Todos</option>
              <option value="admin">Admins</option>
              <option value="technician">Técnicos</option>
              <option value="client">Clientes</option>
            </select>
          </div>
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Changes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) =>
              (userType === 'all') || // Exibe todos os usuários
              (userType === 'admin' && d.role_name === 'Admin') ||
              (userType === 'technician' && d.role_name === 'Technician') ||
              (userType === 'client' && d.role_name === 'Client') ? (
                d.id === editId ? (
                  <tr key={i}>
                    <th>
                      <input
                        type="text"
                        value={unome || ''}
                        onChange={(e) => usetnome(e.target.value)}
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={uemail || ''}
                        onChange={(e) => usetmail(e.target.value)}
                      />
                    </th>
                    <td>
                      <select
                        value={role || ''}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="3">Client</option>
                        <option value="2">Technician</option>
                        <option value="1">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button className="btnEditar" onClick={handleUpdate}>
                        Update
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={i}>
                    <td>{d.nome}</td>
                    <td>{d.email}</td>
                    <td>{d.role_name}</td>
                    <td className="btnAcao">
                      <button className="btnEditar" onClick={() => handleEdit(d.id)}>
                        Edit
                      </button>
                      <button
                        className="btnEliminar"
                        onClick={() => handleDelete(d.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              ) : null // Oculta usuários que não correspondem à seleção
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
