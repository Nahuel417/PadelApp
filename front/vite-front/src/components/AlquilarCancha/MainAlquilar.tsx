import InputsAlquilar from './InputsAlquilar';
import { useUserStore } from '../../store/userStore';
import './MainAlquilar.css';

const Main = () => {
    const userActive = useUserStore((state) => state.userActive);

    return (
        <>
            <main id="main">
                <div className="contenedor-main-alquilar">
                    <h3>Alquilar una Cancha</h3>
                    <hr className="linea-titulo" />

                    <p className="aviso">
                        Complete el siguiente formulario para alquilar una cancha. <b>Recuerde que el horario para hacerlo es de 15:00hs a 23:00hs.</b>
                    </p>

                    <InputsAlquilar user={userActive ? userActive : null} />
                </div>
            </main>
        </>
    );
};

export default Main;
