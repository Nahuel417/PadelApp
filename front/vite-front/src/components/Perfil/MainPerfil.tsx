import CajaAvatarPerfil from './CajaAvatarPerfil';
import CajaInfoPerfil from './CajaInfoPerfil';
import './MainPerfil.css';

const MainPerfil = () => {
    return (
        <>
            <main id="main">
                <div className="contenedor-main-perfil">
                    <h3>Mi Perfil</h3>
                    <hr className="linea-titulo" />

                    <div className="contenedor-perfil">
                        <CajaAvatarPerfil />

                        <CajaInfoPerfil />
                    </div>
                </div>
            </main>
        </>
    );
};

export default MainPerfil;
