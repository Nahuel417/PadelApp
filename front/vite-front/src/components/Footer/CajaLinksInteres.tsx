import React from 'react';
import { Link } from 'react-router-dom';

const CajaLinksInteres = () => {
    return (
        <div className="caja-linksInteres">
            <li>
                <p>LINKS DE INTERÉS</p>
            </li>
            <li>
                <Link to="/about">Acerca de Nosotros</Link>
            </li>
            <li>
                <Link to="https://policies.google.com/privacy?hl=es" target="_blank">
                    Politicas de Privacidad
                </Link>
            </li>
            <li>
                <Link to="">Politicas de Reembolso</Link>
            </li>
            <li>
                <Link to="">¿Necesitas ayuda?</Link>
            </li>
        </div>
    );
};

export default CajaLinksInteres;
