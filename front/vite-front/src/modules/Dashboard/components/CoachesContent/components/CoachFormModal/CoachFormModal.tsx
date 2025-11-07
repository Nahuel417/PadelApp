import React, { useState, useEffect, useCallback } from 'react';
import './CoachFormModal.css';
import Swal from 'sweetalert';
import { Coach, CreateCoachData, createCoach, updateCoach } from '../../../../../../services/coaches';
import { User, getUserByEmail, isUserAlreadyCoach } from '../../../../../../services/users';
import { getCoachAvailability, createCoachAvailability, deleteCoachAvailability } from '../../../../../../services/coachAvailability';

interface FormErrors {
    email?: string;
    hourly_rate?: string;
    specialties?: string;
    experience_years?: string;
    description?: string;
}

interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    id?: string;
}

const DAYS_OF_WEEK = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
];

export interface CoachFormModalProps {
    isOpen: boolean;
    coach: Coach | null;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export const CoachFormModal: React.FC<CoachFormModalProps> = ({ isOpen, coach, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState<CreateCoachData>({
        user_id: '',
        hourly_rate: 0,
        specialties: '',
        experience_years: 0,
        description: '',
    });
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [isSearchingUser, setIsSearchingUser] = useState(false);
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [activeTab, setActiveTab] = useState<'basic' | 'schedule'>('basic');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    // Load coach availability when editing
    const loadCoachAvailability = useCallback(async (coachId: string) => {
        try {
            const availability = await getCoachAvailability(coachId);
            setAvailabilitySlots(
                availability.map((slot) => ({
                    day_of_week: slot.day_of_week,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    id: slot.id,
                }))
            );
        } catch (error) {
            console.error('Error loading coach availability:', error);
        }
    }, []);

    // Reset form when modal opens/closes or coach changes
    useEffect(() => {
        if (isOpen) {
            if (coach) {
                // Edit mode
                setFormData({
                    user_id: coach.user_id,
                    hourly_rate: coach.hourly_rate,
                    specialties: coach.specialties || '',
                    experience_years: coach.experience_years || 0,
                    description: coach.description || '',
                });
                setEmail(coach.user.email);
                setFoundUser({ ...coach.user, created_at: '' });
                loadCoachAvailability(coach.id.toString());
            } else {
                // Add mode
                setFormData({
                    user_id: '',
                    hourly_rate: 0,
                    specialties: '',
                    experience_years: 0,
                    description: '',
                });
                setEmail('');
                setFoundUser(null);
                setAvailabilitySlots([]);
            }
            setErrors({});
            setActiveTab('basic');
        }
    }, [isOpen, coach, loadCoachAvailability]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!foundUser) {
            newErrors.email = 'Debes buscar y seleccionar un usuario válido';
        }

        if (formData.hourly_rate <= 0) {
            newErrors.hourly_rate = 'La tarifa debe ser mayor a 0';
        }

        if (formData.experience_years && formData.experience_years < 0) {
            newErrors.experience_years = 'Los años de experiencia no pueden ser negativos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Search user by email
    const handleEmailSearch = useCallback(async () => {
        if (!email.trim()) {
            setErrors((prev) => ({ ...prev, email: 'Ingresa un email para buscar' }));
            return;
        }

        setIsSearchingUser(true);
        setErrors((prev) => ({ ...prev, email: undefined }));

        try {
            const user = await getUserByEmail(email);
            if (user) {
                // Check if user is already a coach
                const isAlreadyCoach = await isUserAlreadyCoach(user.id);
                if (isAlreadyCoach && !coach) {
                    setErrors((prev) => ({ ...prev, email: 'Este usuario ya es entrenador' }));
                    setFoundUser(null);
                } else {
                    setFoundUser({ ...user, created_at: user.created_at || '' });
                    setFormData((prev) => ({ ...prev, user_id: user.id }));
                }
            } else {
                setErrors((prev) => ({ ...prev, email: 'No se encontró un usuario con este email' }));
                setFoundUser(null);
            }
        } catch (error) {
            console.error('Error searching user:', error);
            setErrors((prev) => ({ ...prev, email: 'Error al buscar usuario' }));
            setFoundUser(null);
        } finally {
            setIsSearchingUser(false);
        }
    }, [email, coach]);

    // Add availability slot
    const addAvailabilitySlot = useCallback(() => {
        setAvailabilitySlots((prev) => [
            ...prev,
            {
                day_of_week: 1,
                start_time: '09:00',
                end_time: '18:00',
            },
        ]);
    }, []);

    // Remove availability slot
    const removeAvailabilitySlot = useCallback((index: number) => {
        setAvailabilitySlots((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // Update availability slot
    const updateAvailabilitySlot = useCallback((index: number, field: keyof AvailabilitySlot, value: string | number) => {
        setAvailabilitySlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
    }, []);

    const handleInputChange = (field: keyof CreateCoachData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const saveAvailability = async (coachId: string) => {
        // Delete existing availability if editing
        if (coach) {
            const existingAvailability = await getCoachAvailability(coachId);
            for (const slot of existingAvailability) {
                await deleteCoachAvailability(slot.id);
            }
        }

        // Create new availability slots
        for (const slot of availabilitySlots) {
            await createCoachAvailability({
                coach_id: coachId,
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            let savedCoach: Coach;

            if (coach) {
                // Update existing coach
                savedCoach = await updateCoach(coach.id, formData);
                Swal({
                    title: 'Actualizado',
                    text: 'El entrenador ha sido actualizado exitosamente.',
                    icon: 'success',
                    timer: 2000,
                });
            } else {
                // Create new coach
                savedCoach = await createCoach(formData);
                Swal({
                    title: 'Creado',
                    text: 'El entrenador ha sido creado exitosamente.',
                    icon: 'success',
                    timer: 2000,
                });
            }

            // Save availability
            await saveAvailability(savedCoach.id.toString());

            onSaveSuccess();
        } catch (error) {
            console.error('Error saving coach:', error);
            Swal({
                title: 'Error',
                text: 'No se pudo guardar el entrenador. Intenta de nuevo.',
                icon: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getDayLabel = (dayValue: number) => {
        return DAYS_OF_WEEK.find((day) => day.value === dayValue)?.label || 'Día';
    };

    if (!isOpen) return null;

    const showFullForm = coach || foundUser;

    return (
        <div className="coach-modal-overlay" onClick={onClose}>
            <div className="coach-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header mejorado */}
                <div className="coach-modal-header-enhanced">
                    <div className="header-left">
                        <div className="header-icon">
                            <i className={`bi ${coach ? 'bi-pencil-square' : 'bi-person-plus'}`}></i>
                        </div>
                        <div className="header-text">
                            <h2>{coach ? 'Editar Entrenador' : 'Agregar Nuevo Entrenador'}</h2>
                            {coach && foundUser && (
                                <p className="header-subtitle">
                                    {foundUser.first_name} {foundUser.last_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <button className="coach-modal-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Tabs mejoradas */}
                {showFullForm && (
                    <div className="coach-modal-tabs-enhanced">
                        <button className={`tab-button-enhanced ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')} type="button">
                            <i className="bi bi-person-circle"></i>
                            <span>Información</span>
                        </button>
                        <button className={`tab-button-enhanced ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')} type="button">
                            <i className="bi bi-calendar-week"></i>
                            <span>Horarios</span>
                            {availabilitySlots.length > 0 && <span className="tab-badge">{availabilitySlots.length}</span>}
                        </button>
                    </div>
                )}

                <form className="coach-form-enhanced" onSubmit={handleSubmit}>
                    {(!showFullForm || activeTab === 'basic') && (
                        <div className="tab-content-enhanced">
                            {/* Búsqueda de usuario */}
                            <div className="form-section">
                                <h3 className="section-title">
                                    <i className="bi bi-search"></i>
                                    Seleccionar Usuario
                                </h3>

                                <div className="form-group-enhanced">
                                    <label htmlFor="email">Email del Usuario *</label>
                                    <div className="email-search-container-enhanced">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={errors.email ? 'error' : ''}
                                            placeholder="usuario@ejemplo.com"
                                            disabled={!!coach}
                                        />
                                        {!coach && (
                                            <button type="button" className="search-btn-enhanced" onClick={handleEmailSearch} disabled={isSearchingUser}>
                                                {isSearchingUser ? <i className="bi bi-arrow-clockwise spin"></i> : <i className="bi bi-search"></i>}
                                            </button>
                                        )}
                                    </div>
                                    {errors.email && <span className="error-message-enhanced">{errors.email}</span>}
                                    {coach && <small className="form-help-enhanced">El email no se puede modificar al editar</small>}
                                </div>

                                {foundUser && (
                                    <div className="user-info-card-enhanced">
                                        <div className="user-info-header-enhanced">
                                            <i className="bi bi-person-check-fill"></i>
                                            <span>Usuario Seleccionado</span>
                                        </div>
                                        <div className="user-details-enhanced">
                                            <div className="user-detail-row">
                                                <span className="detail-label">Nombre:</span>
                                                <span className="detail-value">
                                                    {foundUser.first_name} {foundUser.last_name}
                                                </span>
                                            </div>
                                            <div className="user-detail-row">
                                                <span className="detail-label">Email:</span>
                                                <span className="detail-value">{foundUser.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {showFullForm && (
                                <>
                                    {/* Información Profesional */}
                                    <div className="form-section">
                                        <h3 className="section-title">
                                            <i className="bi bi-briefcase"></i>
                                            Información Profesional
                                        </h3>

                                        <div className="form-grid">
                                            <div className="form-group-enhanced">
                                                <label htmlFor="hourly_rate">Tarifa por hora * (ARS)</label>
                                                <div className="input-with-icon">
                                                    <span className="currency-symbol">$</span>
                                                    <input
                                                        type="number"
                                                        id="hourly_rate"
                                                        min="0"
                                                        step="0.01"
                                                        value={formData.hourly_rate}
                                                        onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                                                        className={errors.hourly_rate ? 'error' : ''}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                {errors.hourly_rate && <span className="error-message-enhanced">{errors.hourly_rate}</span>}
                                            </div>

                                            <div className="form-group-enhanced">
                                                <label htmlFor="experience_years">Años de experiencia</label>
                                                <div className="input-with-icon">
                                                    <span className="input-icon">
                                                        <i className="bi bi-calendar-event"></i>
                                                    </span>
                                                    <input
                                                        type="number"
                                                        id="experience_years"
                                                        min="0"
                                                        value={formData.experience_years}
                                                        onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                                                        className={errors.experience_years ? 'error' : ''}
                                                        placeholder="0"
                                                    />
                                                </div>
                                                {errors.experience_years && <span className="error-message-enhanced">{errors.experience_years}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group-enhanced">
                                            <label htmlFor="specialties">Especialidades</label>
                                            <input
                                                type="text"
                                                id="specialties"
                                                value={formData.specialties}
                                                onChange={(e) => handleInputChange('specialties', e.target.value)}
                                                placeholder="Ej: Técnica, Táctica, Preparación física"
                                            />
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div className="form-section">
                                        <h3 className="section-title">
                                            <i className="bi bi-file-text"></i>
                                            Descripción
                                        </h3>

                                        <div className="form-group-enhanced">
                                            <label htmlFor="description">Información adicional</label>
                                            <textarea
                                                id="description"
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Descripción del entrenador, logros, metodología, certificaciones..."
                                                className="textarea-enhanced"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {showFullForm && activeTab === 'schedule' && (
                        <div className="tab-content-enhanced">
                            <div className="schedule-header-enhanced">
                                <div>
                                    <h3 className="section-title">
                                        <i className="bi bi-calendar-week"></i>
                                        Horarios de Disponibilidad
                                    </h3>
                                    <p className="section-subtitle">Define los horarios en que el entrenador está disponible</p>
                                </div>
                                <button type="button" className="add-slot-btn-enhanced" onClick={addAvailabilitySlot}>
                                    <i className="bi bi-plus-circle"></i>
                                    Agregar Horario
                                </button>
                            </div>

                            <div className="availability-slots-enhanced">
                                {availabilitySlots.length === 0 ? (
                                    <div className="no-slots-enhanced">
                                        <i className="bi bi-calendar-x"></i>
                                        <p>No hay horarios configurados</p>
                                        <small>Agrega horarios para definir la disponibilidad del entrenador</small>
                                    </div>
                                ) : (
                                    availabilitySlots.map((slot, index) => (
                                        <div key={index} className="availability-slot-enhanced">
                                            <div className="slot-number">{index + 1}</div>
                                            <div className="slot-controls-enhanced">
                                                <select
                                                    value={slot.day_of_week}
                                                    onChange={(e) => updateAvailabilitySlot(index, 'day_of_week', parseInt(e.target.value))}
                                                    className="day-select">
                                                    {DAYS_OF_WEEK.map((day) => (
                                                        <option key={day.value} value={day.value}>
                                                            {day.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <input
                                                    type="time"
                                                    value={slot.start_time}
                                                    onChange={(e) => updateAvailabilitySlot(index, 'start_time', e.target.value)}
                                                    className="time-input"
                                                />

                                                <span className="time-separator">→</span>

                                                <input type="time" value={slot.end_time} onChange={(e) => updateAvailabilitySlot(index, 'end_time', e.target.value)} className="time-input" />

                                                <button type="button" className="remove-slot-btn-enhanced" onClick={() => removeAvailabilitySlot(index)} title="Eliminar horario">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div className="slot-preview-enhanced">
                                                {getDayLabel(slot.day_of_week)} de {slot.start_time} a {slot.end_time}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer con acciones */}
                    <div className="form-actions-enhanced">
                        <button type="button" className="btn-cancel-enhanced" onClick={onClose}>
                            <i className="bi bi-x-circle"></i>
                            Cancelar
                        </button>
                        {showFullForm && (
                            <button type="submit" className="btn-save-enhanced" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <i className="bi bi-arrow-clockwise spin"></i>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle"></i>
                                        {coach ? 'Actualizar' : 'Crear'} Entrenador
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
