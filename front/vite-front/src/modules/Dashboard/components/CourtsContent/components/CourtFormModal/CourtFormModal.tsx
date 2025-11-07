import React, { useState, useEffect } from 'react';
import './CourtFormModal.css';
import Swal from 'sweetalert';
import { Court, CreateCourtData, createCourt, updateCourt } from '../../../../../../services/courts';

interface FormErrors {
    name?: string;
    surface_type?: string;
    price_per_hour?: string;
    opening_time?: string;
    closing_time?: string;
}

export interface CourtFormModalProps {
    isOpen: boolean;
    court: Court | null;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export const CourtFormModal: React.FC<CourtFormModalProps> = ({
    isOpen,
    court,
    onClose,
    onSaveSuccess
}) => {
    const [formData, setFormData] = useState<CreateCourtData>({
        name: '',
        surface_type: '',
        price_per_hour: 0,
        opening_time: '08:00',
        closing_time: '22:00'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    // Reset form when modal opens/closes or court changes
    useEffect(() => {
        if (isOpen) {
            if (court) {
                // Edit mode
                setFormData({
                    name: court.name,
                    surface_type: court.surface_type,
                    price_per_hour: court.price_per_hour,
                    opening_time: court.opening_time.slice(0, 5), // Remove seconds
                    closing_time: court.closing_time.slice(0, 5)
                });
            } else {
                // Add mode
                setFormData({
                    name: '',
                    surface_type: '',
                    price_per_hour: 0,
                    opening_time: '08:00',
                    closing_time: '22:00'
                });
            }
            setErrors({});
        }
    }, [isOpen, court]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.surface_type.trim()) {
            newErrors.surface_type = 'El tipo de superficie es requerido';
        }

        if (formData.price_per_hour <= 0) {
            newErrors.price_per_hour = 'El precio debe ser mayor a 0';
        }

        // Validate time logic
        const openingTime = new Date(`2000-01-01T${formData.opening_time}:00`);
        const closingTime = new Date(`2000-01-01T${formData.closing_time}:00`);
        
        if (closingTime <= openingTime) {
            newErrors.closing_time = 'La hora de cierre debe ser posterior a la de apertura';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof CreateCourtData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            if (court) {
                // Update existing court
                await updateCourt(court.id, formData);
                Swal({
                    title: 'Actualizada',
                    text: 'La cancha ha sido actualizada exitosamente.',
                    icon: 'success',
                    timer: 2000,
                });
            } else {
                // Create new court
                await createCourt(formData);
                Swal({
                    title: 'Creada',
                    text: 'La cancha ha sido creada exitosamente.',
                    icon: 'success',
                    timer: 2000,
                });
            }
            
            onSaveSuccess();
        } catch (error) {
            console.error('Error saving court:', error);
            Swal({
                title: 'Error',
                text: 'No se pudo guardar la cancha. Intenta de nuevo.',
                icon: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="court-modal-overlay" onClick={onClose}>
            <div className="court-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="court-modal-header">
                    <h2>{court ? 'Editar Cancha' : 'Agregar Nueva Cancha'}</h2>
                    <button className="court-modal-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form className="court-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre de la cancha *</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={errors.name ? 'error' : ''}
                            placeholder="Ej: Cancha 1"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="surface_type">Tipo de superficie *</label>
                        <select
                            id="surface_type"
                            value={formData.surface_type}
                            onChange={(e) => handleInputChange('surface_type', e.target.value)}
                            className={errors.surface_type ? 'error' : ''}
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="Césped sintético">Césped sintético</option>
                            <option value="Cemento">Cemento</option>
                            <option value="Polvo de ladrillo">Polvo de ladrillo</option>
                            <option value="Resina sintética">Resina sintética</option>
                        </select>
                        {errors.surface_type && <span className="error-message">{errors.surface_type}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price_per_hour">Precio por hora *</label>
                        <input
                            type="number"
                            id="price_per_hour"
                            min="0"
                            step="0.01"
                            value={formData.price_per_hour}
                            onChange={(e) => handleInputChange('price_per_hour', parseFloat(e.target.value) || 0)}
                            className={errors.price_per_hour ? 'error' : ''}
                            placeholder="0.00"
                        />
                        {errors.price_per_hour && <span className="error-message">{errors.price_per_hour}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="opening_time">Hora de apertura</label>
                            <input
                                type="time"
                                id="opening_time"
                                value={formData.opening_time}
                                onChange={(e) => handleInputChange('opening_time', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="closing_time">Hora de cierre</label>
                            <input
                                type="time"
                                id="closing_time"
                                value={formData.closing_time}
                                onChange={(e) => handleInputChange('closing_time', e.target.value)}
                                className={errors.closing_time ? 'error' : ''}
                            />
                            {errors.closing_time && <span className="error-message">{errors.closing_time}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="bi bi-arrow-clockwise spin"></i>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle"></i>
                                    {court ? 'Actualizar' : 'Crear'} Cancha
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
