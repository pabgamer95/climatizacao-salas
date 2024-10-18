import React, { useState, useEffect } from 'react';
export default function AdminPage() {

  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/users');
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Página de Admin</h1>
        <p>Bem-vindo, Admin! Aqui podes gerir o sistema.</p>
        <p>123</p>
 
        <div style={{padding:"50px"}}>
          <table>
            <thead>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <th>{d.id}</th>
                  <th>{d.nome}</th>
                  <th>{d.email}</th>
                  <th>{d.role}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  