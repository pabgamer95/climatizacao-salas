import useWarning from '../Backend/warning';
import useUsers from '../Backend/users';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate aqui
import './css/admin.css';
import Cookies from 'js-cookie'; // Importando o Cookies

export default function WarningsPageAdmin() {
  const navigate = useNavigate(); // Inicializa o useNavigate
  const { dataW, loadingW, errorW } = useWarning(); // Sem valor inicial, já que o hook faz a requisição

  const handleLogout = () => {
    // Remover o cookie "loggedInUser"
    Cookies.remove('loggedInUser', { path: '/' });

    // Redirecionar para a página inicial
    navigate('/'); // Redireciona para a página desejada ("/")
  };

  // Verificar se os dados estão carregando ou se houve erro
  if (loadingW) return <div>Carregando...</div>;
  if (errorW) return <div>Erro ao carregar dados.</div>;

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

                <Link to="#" className="hiperLinks">
                    WARNINGS
                </Link>


          <button className="btnLogout" onClick={handleLogout}>Sair</button>
        </nav>
      </header>

      <h1 className="txt">Lista de Warnings</h1>

      <div>
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Mensagem</th>
              <th>Sensor</th>
              <th>Localização</th>
            </tr>
          </thead>
          <tbody>
            {dataW.map((d, i) => (
              <tr key={i}>
                <td>{new Date(d.data_warning).toLocaleDateString()}</td>
                <td>{new Date(d.data_warning).toLocaleTimeString()}</td>
                <td>{d.mensagem}</td>
                <td>{d.sensor}</td>
                <td>{d.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
