import React from 'react';
import CajaLinksInteres from './CajaLinksInteres';
import CajaPaginas from './CajaPaginas';
import CajaRedes from './CajaRedes';
import CajaCopyright from './CajaCopyright';
import './Footer.css';

const Footer = () => {
    return (
        <>
            <footer id="footer">
                <div className="contenedor-footer">
                    <CajaLinksInteres />

                    <CajaPaginas />

                    <CajaRedes />

                    <CajaCopyright />
                </div>
            </footer>
        </>
    );
};

export default Footer;
