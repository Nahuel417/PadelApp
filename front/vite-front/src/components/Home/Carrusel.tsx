import React from 'react';

const Carrusel = () => {
    return (
        <div className="caja-carrusel-fondo">
            <div id="carouselExampleAutoplaying" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="2000">
                        <img src="/carrusel-1.webp" className="d-block w-100" />
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                        <img src="/carrusel-2.webp" className="d-block w-100" />
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                        <img src="/carrusel-3.webp" className="d-block w-100" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrusel;
