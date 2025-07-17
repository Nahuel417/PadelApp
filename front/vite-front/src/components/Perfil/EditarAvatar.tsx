import { useEffect, useState } from 'react';

const EditarAvatar = ({ handleOnClose }) => {
    const [mostrar, setMostrar] = useState(false);
    const [ocultar, setOcultar] = useState(false);

    useEffect(() => {
        setMostrar(true);
    }, []);

    const handleClose = () => {
        setOcultar(true);

        setTimeout(() => {
            setMostrar(false);
            handleOnClose();
        }, 300);
    };

    return (
        <div className={`contenedor-editarAvatar ${mostrar ? 'mostrar' : ''} ${ocultar ? 'ocultar' : ''}`}>
            <p>Elija una nueva foto de Perfil </p>
            <div>
                <label> Foto de Perfíl </label>
                <input type="file" name="nuevoAvatar" className="nuevoAvatar" required />
                <span className="feedback-negativo" id="feedback-negativo"></span>
                <div className="caja-botones-avatar">
                    <button type="submit"> Guardar </button>
                    <button onClick={handleClose} className="cerrar">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarAvatar;
