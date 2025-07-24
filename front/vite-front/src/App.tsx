import Home from './views/Home';
import AlquilarCancha from './views/AlquilarCancha';
import Historial from './views/Historial';
import Login from './views/Login';
import Registro from './views/Registro';
import Perfil from './views/Perfil';
import About from './views/About';
import Contacto from './views/Contacto';
import Error404 from './views/Error404';
// import Ejemplo from './components/EjemploUseEffect/Ejemplo';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { useUserStore } from './store/userStore';
import PrivateRoute from './routes/PrivateRoute/PrivateRoute';
import PublicRoute from './routes/PublicRoute/PublicRoute';
import Dashboard from './views/Dashboard';

const App = () => {
    const addUserActive = useUserStore((state) => state.addUserActive);
    const removeUserActive = useUserStore((state) => state.removeUserActive);

    useEffect(() => {
        const checkStoredUser = async () => {
            const localUser = localStorage.getItem('userActive');
            const sessionUser = sessionStorage.getItem('userActive');
            const user = localUser || sessionUser;

            if (user) {
                // Podés validar la sesión en supabase
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (session?.user?.id) {
                    addUserActive(JSON.parse(user));
                } else {
                    // Sesión no válida -> limpiar storages
                    localStorage.removeItem('userActive');
                    sessionStorage.removeItem('userActive');
                    removeUserActive();
                }
            } else {
                removeUserActive();
            }
        };
        checkStoredUser();
    }, []);

    return (
        <>
            <Routes>
                //? RUTAS LIBRES
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="*" element={<Error404 />} />
                {/* <Route path="" element={<Ejemplo />} /> */}
                //! RUTAS PROTEGIDAS
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/historial" element={<Historial />} />
                    <Route path="/alquilar-cancha" element={<AlquilarCancha />} />
                    <Route path="/mi-perfil" element={<Perfil />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
