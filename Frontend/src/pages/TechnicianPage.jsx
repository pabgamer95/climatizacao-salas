import './css/tech.css';
import { Link } from 'react-router-dom'; 


export default function TechnicianPage() {
    return (

      <div>
        <header>
        
        <nav className="navBar">
          <h1 className="nomeApp">AMBIENTRACK</h1>
          <Link to="/sensors" className="hiperLinks">
            SENSORES
          </Link>
          <a href="#" className="hiperLinks">
            ALERTAS
          </a>
        </nav>
      </header>

        <h1 className="text-3xl font-bold">Página de Técnico</h1>
        <p>Bem-vindo, Técnico! Aqui podes ver as tuas tarefas.</p>
        <p>789</p>
      </div>
    );
  }
  