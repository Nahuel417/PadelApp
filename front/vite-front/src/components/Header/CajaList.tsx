import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarPhone from './NavbarPhone';
import { useUserStore } from '../../store/userStore';
import { UserRole } from '../../utils/enums/roles.enum';

const CajaList = () => {
    const user = useUserStore((state) => state.userActive);
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
                <i className="bi bi-list"></i>
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
                <li>{!user || user?.role_id === UserRole.USER ? <Link to="/contacto"> Contacto </Link> : <Link to="/dashboard"> Dashboard </Link>}</li>
            </ul>
            {navbar && <NavbarPhone handleCerrar={handleCerrar} />}
        </div>
    );
};

export default CajaList;
