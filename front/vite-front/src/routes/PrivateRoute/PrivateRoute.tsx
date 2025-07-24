import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const PrivateRoute = () => {
    const user = useUserStore((state) => state.userActive);
    const [showAlert, setShowAlert] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (user === null && !showAlert) {
            setShowAlert(true);
            swal({
                title: '¡Error de autenticación!',
                text: 'Debe iniciar sesión para continuar',
                icon: 'warning',
            });

            setRedirect(true);
        }
    }, [user, showAlert]);

    if (redirect) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return null;
    }

    return <Outlet />;
};

export default PrivateRoute;
