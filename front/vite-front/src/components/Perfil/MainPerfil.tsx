import { useNavigate } from 'react-router-dom';
import CajaAvatarPerfil from './CajaAvatarPerfil';
import CajaInfoPerfil from './CajaInfoPerfil';
import './MainPerfil.css';
import { useUserStore } from '../../store/userStore';
import { useEffect } from 'react';

const MainPerfil = () => {
    const userActive = useUserStore((state) => state.userActive);

    return (
        <>
            <main id="main">
                <div className="contenedor-main-perfil">
                    <h3>Mi Perfil</h3>
                    <hr className="linea-titulo" />

                    <div className="contenedor-perfil">
                        <CajaAvatarPerfil />

                        <CajaInfoPerfil userActive={userActive} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default MainPerfil;
