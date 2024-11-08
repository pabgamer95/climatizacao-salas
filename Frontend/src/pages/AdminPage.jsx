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
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Changes</th>
          </thead>
          <tbody>
            {
              data.map((d, i) => (
                d.id === editId ? 
                <tr>
                  <th>{d.id}</th>
                  <th><input type="text" value={d.nome} onChange = {e => setNome(e.target.value)}/></th>
                  <th><input type="text" value={d.email} onChange = {e => setEmail(e.target.value)}/></th>
                  <th><select value={d.role} onChange = {e => setRole(e.target.value)}>
                    <option value="client">Cliente</option>
                    <option value="technician">Técnico</option>
                    <option value="admin">Admin</option>
                </select></th>
                  <th><button onClick={handleUpdate}>Update</button></th>
                </tr>
                :
                <tr key={i}>
                  <th>{d.id}</th>
                  <th>{d.nome}</th>
                  <th>{d.email}</th>
                  <th>{d.role}</th>
                  <th>
                    <button onClick={() => handleEdit(d.id)}>edit</button>
                    <button>delete</button>
                  </th>
                </tr> 
              ))
            }
            
          </tbody>
        </table>
      </div>
    </div>
  );
}
