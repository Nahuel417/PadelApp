import InputsAlquilar from './InputsAlquilar';
import { useUserStore } from '../../store/userStore';
import { User } from '../../interfaces/userInterface';
import './MainAlquilar.css';

const Main = () => {
    const userActive: User = useUserStore((state) => state.userActive);

    return (
        <>
            <main id="main">
                <div className="contenedor-main-alquilar">
                    <h3>Reservar una Cancha</h3>
                    <hr className="linea-titulo" />

                    <p className="aviso">
                        Complete el siguiente formulario para reservar una cancha. <b>Recuerde que el horario para hacerlo es de 07:00hs a 01:00hs.</b>
                    </p>

                    <InputsAlquilar user={userActive ? userActive : null} />
                </div>
            </main>
        </>
    );
};

export default Main;
