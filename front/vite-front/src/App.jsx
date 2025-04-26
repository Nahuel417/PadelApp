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

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/alquilar-cancha" element={<AlquilarCancha />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/mi-perfil" element={<Perfil />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="*" element={<Error404 />} />
                {/* <Route path="" element={<Ejemplo />} /> */}
            </Routes>
        </>
    );
};

export default App;
