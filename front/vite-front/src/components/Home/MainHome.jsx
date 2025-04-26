import React from 'react';
import Carrusel from './Carrusel';
import CajaLetras from './CajaLetras';
import ContenedorTextos from './ContenedorTextos';
import './MainHome.css';

const Main = () => {
    return (
        <>
            <main id="main">
                <div className="contenedor-main-home">
                    <Carrusel />

                    <CajaLetras />

                    <ContenedorTextos />
                </div>
            </main>
        </>
    );
};

export default Main;
