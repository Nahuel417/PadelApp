import './CajaThead.css';

const CajaThead = () => {
    return (
        <div className="caja-thead">
            <div className="col-fecha-thead">
                <span>Fecha</span>
            </div>
            <div className="col-horario-thead">
                <span>Hora</span>
            </div>
            <div className="col-asunto-thead">
                <span>Asunto</span>
            </div>
            <div className="col-cancha-thead">
                <span>Cancha</span>
            </div>
            <div className="col-estado-thead">
                <span>Estado</span>
            </div>
            <div className="col-entrenador-thead">
                <span>Entrenador</span>
            </div>
            <div className="col-cancelar-thead">
                <span>Cancelación</span>
            </div>
        </div>
    );
};

export default CajaThead;
