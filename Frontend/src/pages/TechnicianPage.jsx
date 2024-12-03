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

       
      </div>
    );
  }
  