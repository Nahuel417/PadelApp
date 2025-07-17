import CajaFormRegistro from './CajaFormRegistro';
import './MainRegistro.css';

const MainRegistro = () => {
    return (
        <>
            <main id="main">
                <div className="contenedor-main-registro">
                    <h3>Formulario de registro</h3>
                    <hr className="linea-titulo" />

                    <CajaFormRegistro />
                </div>
            </main>
        </>
    );
};

export default MainRegistro;
