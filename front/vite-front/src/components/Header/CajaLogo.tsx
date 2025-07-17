import React from 'react';
import { Link } from 'react-router-dom';

const CajaLogo = () => {
    return (
        <div className="caja-logo">
            <Link className="logo" to="/about">
                <img src="/logo.webp" alt="" />
            </Link>
        </div>
    );
};

export default CajaLogo;
