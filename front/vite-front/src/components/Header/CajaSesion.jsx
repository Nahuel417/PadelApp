import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const CajaSesion = () => {
    const ruta = useLocation();
    const userActive = useSelector((state) => state.userData.userActive);

    return (
        <div className={`caja-sesion`}>
            {userActive !== null ? (
                <Link to="/mi-perfil"> Mi Perfil </Link>
            ) : ruta.pathname === '/login' ? (
                <Link to="/registro"> Registrarse </Link>
            ) : (
                <Link to="/login"> Iniciar Sesion </Link>
            )}
        </div>
    );
};

export default CajaSesion;
