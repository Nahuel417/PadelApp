import { Navigate } from 'react-router-dom';
import MainDashboard from '../components/Dashboard/MainDashboard';
import { useUserStore } from '../store/userStore';
import { UserRole } from '../utils/roles.enum';
import CoachDashboard from '../components/Dashboard/CoachDashboard/CoachDashboard';
import Header from '../components/Header/Header';

const Dashboard = () => {
    const user = useUserStore((state) => state.userActive);

    if (user.role_id === UserRole.USER) {
        swal({
            title: 'Acceso restringido',
            text: 'No tenés permisos suficientes para ingresar aquí.',
            icon: 'warning',
        });

        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Header />
            {user.role_id === UserRole.COACH ? <CoachDashboard /> : <MainDashboard />}
        </>
    );
};

export default Dashboard;
