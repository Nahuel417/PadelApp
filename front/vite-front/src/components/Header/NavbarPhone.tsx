import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const NavbarPhone = ({ handleCerrar }) => {
    const userActive = useSelector((state) => state.userData.userActive);
    const ruta = useLocation();

    const [mostrar, setMostrar] = useState(false);
    const [ocultar, setOcultar] = useState(false);

    useEffect(() => {
        setMostrar(true);
    }, []);

    const handleOnClose = () => {
        setOcultar(true);

        setTimeout(() => {
            setMostrar(false);
            handleCerrar();
        }, 300);
    };

    return (
        <div className={`ul-phone ${mostrar ? 'mostrar' : ''} ${ocultar ? 'ocultar' : ''}`}>
            <button className="boton-cerrar" onClick={handleOnClose}>
                <i class="bi bi-x-lg"></i>
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
                <li>
                    <Link to="/about"> About </Link>
                </li>
                <li>
                    {userActive !== null ? (
                        <Link to="/mi-perfil"> Perfil </Link>
                    ) : ruta.pathname === '/login' ? (
                        <Link to="/registro"> Registrarse </Link>
                    ) : (
                        <Link to="/login"> Iniciar Sesión </Link>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default NavbarPhone;
