import React from 'react';
import './FiltroReserva.css';

interface FiltroReservasProps {
    estadoSeleccionado: string;
    onChange: (estado: string) => void;
}

const estados = [
    { value: '', label: 'Todos' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'cancelled', label: 'Canceladas' },
];

const FiltroReserva: React.FC<FiltroReservasProps> = ({ estadoSeleccionado, onChange }) => {
    return (
        <div className="contenedor-filtro-reservas">
            {estados.map((estado) => (
                <button key={estado.value} type="button" className={`filtro-boton ${estadoSeleccionado === estado.value ? 'activo' : ''}`} onClick={() => onChange(estado.value)}>
                    {estado.label}
                </button>
            ))}
        </div>
    );
};

export default React.memo(FiltroReserva);
