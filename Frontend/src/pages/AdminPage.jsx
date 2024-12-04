import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate aqui
import axios from 'axios';
import useUsers from '../Backend/users';
import './css/admin.css';
import logoteste from './imagens/logoteste.webp'; 
import Cookies from 'js-cookie'; // Importando o Cookies

export default function AdminPage() {
  const navigate = useNavigate(); // Inicializa o useNavigate
  const { data, loading, error, setData } = useUsers([]);
  const [editId, setEditID] = useState(-1);
  const [unome, usetnome] = useState('');
  const [uemail, usetmail] = useState('');
  const [role, setRole] = useState('');

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
          <a href="#" className="hiperLinks">
            ALERTAS
          </a>
          <button className="btnLogout" onClick={handleLogout}>Sair</button>
        </nav>
      </header>

      <h1 className="txt1">Lista de Utilizadores</h1>

      <div>
        <Link to="/admin/register">
          <button className="btnCriarUtilizador">Criar Utilizador</button>
        </Link>
      </div>

      <div>
        <table className="tabela1">
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
