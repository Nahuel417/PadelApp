import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const PublicRoute = () => {
    const user = useUserStore((state) => state.userActive);

    return user ? <Navigate to="/mi-perfil" replace /> : <Outlet />;
};

export default PublicRoute;
