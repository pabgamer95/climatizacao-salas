import React, {useState} from 'react';
import axios from 'axios';
import useUsers from '../Backend/users';
import  './css/admin.css';
import './imagens/logoteste.webp';

export default function AdminPage() {
 const {data, loading, error } = useUsers();
 const [editId, setEditID] = useState(-1);
 const [nome, setNome] = useState()
 const [email ,setEmail] = useState()
/*  const [newNome, newSetNome] = useState()
 const [newEmail ,newSetEmail] = useState() */
 const [role , setRole] = useState()

 if (loading) return <p>Loading...</p>;
 if (error) return <p>Error fetching data: {error.message}</p>;




  const handleEdit = (id) =>{
    axios.get('http://localhost:8081/users/:id')
    .then(res => {
      console.log(res.data)
      
    })
    setEditID(id)
  }

  const handleUpdate = () => {
    axios.put('http://localhost:8081/users/:id', {id:editId, nome, email, role})
    .then(res => {
      console.log(res)
      setEditID(-1)
    }).catch(err => console.log(err));
  }

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
              <th>ID</th>
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
                  <td>{d.id}</td>
                  <td><input type="text" value={d.nome} onChange = {e => setNome(e.target.value)}/></td>
                  <td><input type="text" value={d.email} onChange = {e => setEmail(e.target.value)}/></td>
                  <td><select value={d.role} onChange = {e => setRole(e.target.value)}>
                    <option value="client">Cliente</option>
                    <option value="technician">Técnico</option>
                    <option value="admin">Admin</option>
                </select>
                </td>
                  <td><button className='btnEditar' onClick={handleUpdate}>Update</button></td>
                </tr>
                :
                <tr key={i}>
                  <td>{d.id}</td>
                  <td>{d.nome}</td>
                  <td>{d.email}</td>
                  <td>{d.role}</td>
                  <td btnAcao>
                    <button className='btnEditar' onClick={() => handleEdit(d.id)}>Edit</button> 
                    <button className='btnEliminar'>Delete</button>
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
