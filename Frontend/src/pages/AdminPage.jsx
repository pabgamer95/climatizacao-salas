
import React from 'react';
import useUsers from '../getBackend/users';
import  './css/admin.css';
import './imagens/logoteste.webp';

export default function AdminPage() {
 // const { data, loading, error } = useUsers();

  ///if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error fetching data: {error.message}</p>;
  const users = [
    { id:1, nome: "Admin", email: "admin@example.com", role: "admin"},
    { id:2, nome: "Client", email: "client@example.com", role: "client"},
    { id:3, nome: "Technician", email: "technician@example.com", role: "technician"},
  ];



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
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user.id}>
                <th>{user.id}</th>
                <th>{user.nome}</th>
                <th>{user.email}</th>
                <th>{user.role}</th>
              </tr>
            ))}
           {/*} {data.map((d, i) => (
              <tr key={i}>
                <th>{d.id}</th>
                <th>{d.nome}</th>
                <th>{d.email}</th>
                <th>{d.role}</th>
              </tr> 
            ))} */}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}
