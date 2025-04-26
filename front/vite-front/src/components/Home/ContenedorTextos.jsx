import React from 'react';
import CajaTextos1 from './CajaTextos1';
import CajaTextos2 from './CajaTextos2';

const ContenedorTextos = () => {
    return (
        <div className="contenedor-textos" id="comoFunciona">
            <hr className="linea-main" />

            <CajaTextos1 />

            <CajaTextos2 />

            <hr className="linea-main-2" />
        </div>
    );
};

export default ContenedorTextos;
