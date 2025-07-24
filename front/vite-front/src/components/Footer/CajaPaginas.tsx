import { Link } from 'react-router-dom';

const CajaPaginas = () => {
    return (
        <div className="caja-paginas">
            <li>
                <p>PÁGINAS</p>
            </li>
            <li>
                <Link to="/"> Home </Link>
            </li>
            <li>
                <Link to="/historial"> Mi Historial </Link>
            </li>
            <li>
                <Link to="/alquilar-cancha"> Alquilar Cancha </Link>
            </li>
            <li>
                <Link to="/registro"> Registrar Usuario </Link>
            </li>
        </div>
    );
};

export default CajaPaginas;
