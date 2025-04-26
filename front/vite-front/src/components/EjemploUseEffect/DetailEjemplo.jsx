import axios from 'axios';
import { useEffect, useState } from 'react';

const DetailEjemplo = ({ handleOnClose, id }) => {
    const [personaje, setPersonaje] = useState({});

    useEffect(() => {
        axios.get(`https://hp-api.onrender.com/api/character/${id}`).then((res) => setPersonaje(res.data[0]));
    }, []);

    return (
        <div className="contenedor-detalle">
            {Object.keys(personaje).length === 0 ? (
                <h2>Cargando info...</h2>
            ) : (
                <>
                    <p>soy el detalle de {personaje?.name}</p>
                    <p>especie: {personaje?.species}</p>
                    <p>genero: {personaje?.gender}</p>
                    <p>es mago? {personaje?.wizard ? 'si' : 'no'}</p>
                </>
            )}
            <button onClick={() => handleOnClose()}> Cerrar </button>
        </div>
    );
};

export default DetailEjemplo;
