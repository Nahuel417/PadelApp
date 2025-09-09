import CajaAvatarPerfil from './CajaAvatarPerfil';
import CajaInfoPerfil from './CajaInfoPerfil';
import { useUserStore } from '../../store/userStore';
import './MainPerfil.css';

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
