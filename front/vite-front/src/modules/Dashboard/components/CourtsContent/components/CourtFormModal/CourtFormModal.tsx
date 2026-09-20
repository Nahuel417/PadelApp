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
    const [priceInput, setPriceInput] = useState('');

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
                setPriceInput(
                    court.price_per_hour !== undefined && court.price_per_hour !== null
                        ? `${court.price_per_hour}`
                        : ''
                );
            } else {
                // Add mode
                setFormData({
                    name: '',
                    surface_type: '',
                    price_per_hour: 0,
                    opening_time: '08:00',
                    closing_time: '22:00'
                });
                setPriceInput('');
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof CreateCourtData, value: string | number) => {
        setFormData((prev) => ({
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

    const handlePriceChange = (value: string) => {
        const sanitizedValue = value.replace(',', '.');
        if (/^\d*(\.\d{0,2})?$/.test(sanitizedValue)) {
            setPriceInput(sanitizedValue);
            const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
            handleInputChange('price_per_hour', numericValue);
        }
    };

    const adjustPrice = (delta: number) => {
        const currentValue = parseFloat(priceInput || '0');
        const baseValue = Number.isNaN(currentValue) ? 0 : currentValue;
        const nextValue = Math.max(0, baseValue + delta);
        const normalized = nextValue.toFixed(2);
        const trimmedValue = normalized.replace(/\.00$/, '').replace(/\.([1-9])0$/, '.$1');
        setPriceInput(trimmedValue);
        handleInputChange('price_per_hour', parseFloat(normalized));
    };

    const handlePriceKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            adjustPrice(1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            adjustPrice(-1);
        }
    };

    const handlePriceBlur = () => {
        if (priceInput === '') {
            return;
        }

        const normalized = priceInput.endsWith('.') ? priceInput.slice(0, -1) : priceInput;
        setPriceInput(normalized);
        handleInputChange('price_per_hour', normalized === '' ? 0 : parseFloat(normalized));
    };

    const triggerTimePicker = (
        event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>
    ) => {
        const inputElement = event.currentTarget as HTMLInputElement & {
            showPicker?: () => void;
        };
        if (typeof inputElement.showPicker === 'function') {
            inputElement.showPicker();
        }
    };

    const ensureTimeValue = (field: 'opening_time' | 'closing_time', fallback: string) => {
        setFormData((prev) => {
            const currentValue = prev[field];
            if (currentValue && currentValue.trim() !== '') {
                return prev;
            }
            return {
                ...prev,
                [field]: fallback
            };
        });

        if (errors[field]) {
            setErrors((prev) => ({
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
                        <div className="input-with-icon">
                            <span className="currency-symbol">$</span>
                            <input
                                type="text"
                                id="price_per_hour"
                                inputMode="decimal"
                                value={priceInput}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                onBlur={handlePriceBlur}
                                onKeyDown={handlePriceKeyDown}
                                className={errors.price_per_hour ? 'error' : ''}
                                placeholder="0.00"
                            />
                        </div>
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
                                onBlur={() => ensureTimeValue('opening_time', '08:00')}
                                onFocus={triggerTimePicker}
                                onClick={triggerTimePicker}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="closing_time">Hora de cierre</label>
                            <input
                                type="time"
                                id="closing_time"
                                value={formData.closing_time}
                                onChange={(e) => handleInputChange('closing_time', e.target.value)}
                                onBlur={() => ensureTimeValue('closing_time', '22:00')}
                                onFocus={triggerTimePicker}
                                onClick={triggerTimePicker}
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
