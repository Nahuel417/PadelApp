import FormContacto from './FormContacto';
import './MainContacto.css';

const MainContacto = () => {
    return (
        <>
            <main>
                <div className="contenedor-main-contacto">
                    <h3>Contacto</h3>
                    <hr className="linea-titulo" />

                    <FormContacto />
                </div>
            </main>
        </>
    );
};

export default MainContacto;
