import './Ejemplo.css';

const CardEjemplo = ({ nombre, actor, cumple, handleOnClick, id }) => {
    return (
        <div>
            <h1> {nombre} </h1>
            <h3> {actor} </h3>
            <h3> {cumple ? cumple : '19-07-2000'} </h3>
            <button onClick={() => handleOnClick(id)}> Detalle </button>
        </div>
    );
};

export default CardEjemplo;
