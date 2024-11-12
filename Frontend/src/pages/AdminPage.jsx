import React, {useState} from 'react';
import axios from 'axios';
import useUsers from '../Backend/users';
import  './css/admin.css';
import './imagens/logoteste.webp';

export default function AdminPage() {
 const {data, loading, error, setData } = useUsers([]);
 const [editId, setEditID] = useState(-1);
 const [nome, setNome] = useState()
 const [email ,setEmail] = useState()
 const [unome, usetnome] = useState()
 const [uemail ,usetmail] = useState()
 const [role , setRole] = useState()

 if (loading) return <p>Loading...</p>;
 if (error) return <p>Error fetching data: {error.message}</p>;




  const handleEdit = (id) =>{
    axios.get('http://localhost:8081/users/' + id)
    .then(res => {
      console.log(res.data)
      usetnome(res.data.nome); // Atualiza o estado com o nome do usuário
      usetmail(res.data.email); // Atualiza o estado com o email do usuário
      setRole(res.data.role);   // Atualiza o estado com o role do usuário
      
    })
    .catch(er => console.log(er));
    setEditID(id)
  }

  const handleUpdate = () => {
    if (!unome || !uemail || !role) {
        console.error("Erro: Campos obrigatórios estão vazios");
        alert("Todos os campos são obrigatórios para a atualização.");
        return;
    }

    const updatedUser = {
        nome: unome,
        email: uemail,
        role: role
    };

    axios.put(`http://localhost:8081/users/${editId}`, updatedUser)
        .then(res => {
            console.log("User updated:", res.data);
            setEditID(-1);

            const updatedData = data.map(user =>
                user.id === editId ? { ...user, ...updatedUser } : user
            );
            setData(updatedData);
        })
        .catch(err => {
            console.error("Erro ao atualizar o utilizador:", err);
        });
};

const handleDelete = (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este utilizador?')) {
        // Corrigido: Endpoint DELETE com id correto
        axios.delete(`http://localhost:8081/users/${id}`)
            .then(res => {
                console.log('utilizador excluído com sucesso!');
                const updatedData = data.filter(user => user.id !== id);
                setData(updatedData);
            })
            .catch(er => {
                console.error(er);
                console.log('Ocorreu um erro ao tentar excluir o utilizador.');
            });
    }
  };
 

  return (
    
    <div>
      <header>
        
        <nav className="navBar">
            <img className="logo" src="logoteste.webp" alt="" /> 
            <h1 className="nomeApp">AMBIENTRACK</h1>
            <a href="#" className="hiperLinks">UTILIZADORES</a>
            <a href="#" className='hiperLinks'>DISPOSITIVOS</a>

        </nav>
      </header>
    
      <h1 className="txt1">Admin Page</h1>
      

      <div style={{ padding: "50px" }}>
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
            {
              data.map((d, i) => (
                d.id === editId ? 
                <tr>
                  <th>
                    <input 
                      type="text" 
                      value={unome || ''}  // Garante que o campo tem um valor inicial
                      onChange={e => usetnome(e.target.value)}  // Atualiza o estado ao digitar
                    />
                  </th>
                  <th>
                    <input 
                      type="text" 
                      value={uemail || ''} // Garante que o campo tem um valor inicial
                      onChange={e => usetmail(e.target.value)}  // Atualiza o estado ao digitar
                    />
                  </th>
                  <td>
                    <select 
                      value={role || ''}  // Garante que o campo tem um valor inicial
                      onChange={e => setRole(e.target.value)}  // Atualiza o estado ao mudar a opção
                    >
                    <option value="client">Cliente</option>
                    <option value="technician">Técnico</option>
                    <option value="admin">Admin</option>
                </select>
                </td>
                  <td><button className='btnEditar' onClick={handleUpdate}>Update</button></td>
                </tr>
                :
                <tr key={i}>
                  <td>{d.nome}</td>
                  <td>{d.email}</td>
                  <td>{d.role}</td>
                  <td className='btnAcao'>
                    <button className="btnEditar" onClick={() => handleEdit(d.id)}>Edit</button>
                    <br />

                    <button className="btnEliminar" onClick={() => handleDelete(d.id)}>Delete</button>
                  </td>
                </tr> 
              ))
            }
            
          </tbody>
        </table>
      </div>
    </div>
  );
}
