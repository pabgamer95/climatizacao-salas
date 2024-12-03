import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importando o Link do React Router
import useUsers from '../Backend/users';
import './css/admin.css'; // Verifique se o caminho do arquivo está correto
import logoteste from './imagens/logoteste.webp'; // Verifique a imagem também, se necessário

export default function AdminPage() {
  const { data, loading, error, setData } = useUsers([]);
  const [editId, setEditID] = useState(-1);
  const [unome, usetnome] = useState('');
  const [uemail, usetmail] = useState('');
  const [role, setRole] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const handleEdit = (id) => {
    axios
      .get('http://localhost:8081/users/' + id)
      .then((res) => {
        console.log(res.data);
        usetnome(res.data.nome);
        usetmail(res.data.email);
        setRole(res.data.role_id);
      })
      .catch((er) => console.log(er));
    setEditID(id);
  };

  const handleUpdate = () => {
    if (!unome || !uemail || !role) {
      console.error('Erro: Campos obrigatórios estão vazios');
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

  const handleDelete = (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este utilizador?')) {
      axios
        .delete(`http://localhost:8081/users/${id}`)
        .then((res) => {
          console.log('Utilizador excluído com sucesso!');
          const updatedData = data.filter((user) => user.id !== id);
          setData(updatedData);
        })
        .catch((er) => {
          console.error(er);
          console.log('Ocorreu um erro ao tentar excluir o utilizador.');
        });
    }
  };

  return (
    <div>
      <header>
        <nav className="navBar">
          <h1 className="nomeApp">AMBIENTRACK</h1>
          <Link to="/admin" className="hiperLinks">
            UTILIZADORES
          </Link>
          <Link to="/sensors" className="hiperLinks">
            SENSORES
          </Link>
          <a href="#" className="hiperLinks">
            ALERTAS
          </a>
        </nav>
      </header>

      <h1 className="txt1">Admin Page</h1>

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
