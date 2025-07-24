import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const CajaSesion = () => {
    const ruta = useLocation();
    const userActive = useUserStore((state) => state.userActive);

    return (
        <div className={`caja-sesion`}>
            {userActive !== null && userActive !== undefined ? (
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
