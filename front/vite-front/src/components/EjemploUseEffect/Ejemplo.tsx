import { useEffect, useState } from 'react';
import CardEjemplo from './CardEjemplo';
import DetailEjemplo from './DetailEjemplo';

const Ejemplo = () => {
    const [personajes, setPersonajes] = useState([]);
    const [detail, setDetail] = useState(false);
    const [id, setId] = useState(0);

    const handleOnClick = (id) => {
        setId(id);
        setDetail(true);
    };

    const handleOnClose = () => {
        setDetail(false);
        setId(0);
    };

    useEffect(() => {
        fetch('https://hp-api.onrender.com/api/characters')
            .then((response) => response.json())
            .then((data) => setPersonajes(data.slice(0, 15)));
    }, []);

    return (
        <>
            <div className="contenedor">
                {personajes.map((personaje) => {
                    return (
                        <CardEjemplo
                            key={personaje.id}
                            id={personaje.id}
                            nombre={personaje.name}
                            actor={personaje.actor}
                            cumple={personaje.dateOfBirth}
                            handleOnClick={handleOnClick}
                        />
                    );
                })}

                {detail && <DetailEjemplo id={id} handleOnClose={handleOnClose} />}
            </div>
        </>
    );
};

export default Ejemplo;
