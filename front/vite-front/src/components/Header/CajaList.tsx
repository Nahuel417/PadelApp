import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarPhone from './NavbarPhone';

const CajaList = () => {
    const [navbar, setNavbar] = useState(false);

    const handleAbrir = () => {
        setNavbar(true);
    };

    const handleCerrar = () => {
        setNavbar(false);
    };

    return (
        <div className="caja-ul">
            <button className="boton-abrir" onClick={handleAbrir}>
                <i class="bi bi-list"></i>
            </button>
            <ul>
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
                    <Link to="/contacto"> Contacto </Link>
                </li>
            </ul>
            {navbar && <NavbarPhone handleCerrar={handleCerrar} />}
        </div>
    );
};

export default CajaList;
