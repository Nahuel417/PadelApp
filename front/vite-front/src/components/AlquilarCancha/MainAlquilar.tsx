import React, { useEffect } from 'react';
import InputsAlquilar from './InputsAlquilar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MainAlquilar.css';
import { RootState } from '../../redux/store';
import { useUserStore } from '../../store/userStore';

const Main = () => {
    const userActive = useUserStore((state) => state.userActive);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!userActive) {
    //         swal({
    //             title: '¡Error de autenticación!',
    //             text: 'Debe iniciar sesión para continuar',
    //             icon: 'warning',
    //         });
    //         navigate('/login');
    //     }
    // }, [userActive, navigate]);

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
