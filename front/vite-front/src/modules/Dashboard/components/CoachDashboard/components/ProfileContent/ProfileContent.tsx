import React, { useState } from 'react';
import { CoachProfile, updateCoachProfile, UpdateCoachProfileData, updateUserData } from '../../../../../../services/coachServices';
import Swal from 'sweetalert';
import './ProfileContent.css';

export interface ProfileContentProps {
    coachProfile: CoachProfile;
    onProfileUpdate: (updatedProfile: CoachProfile) => void;
}

interface FormData {
    bio: string;
    hourly_rate: number;
    is_available: boolean;
    phone: string;
    genre: string;
}

interface FormState {
    hourlyRateInput: string;
}

interface FormErrors {
    bio?: string;
    hourly_rate?: string;
    phone?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ coachProfile, onProfileUpdate }) => {
    const [formData, setFormData] = useState<FormData>({
        bio: coachProfile.bio || '',
        hourly_rate: coachProfile.hourly_rate || 0,
        is_available: coachProfile.is_available,
        phone: coachProfile.phone || '',
        genre: coachProfile.user.genre || 'otro',
    });
    const [hourlyRateInput, setHourlyRateInput] = useState(coachProfile.hourly_rate ? `${coachProfile.hourly_rate}` : '');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (formData.hourly_rate <= 0) {
            newErrors.hourly_rate = 'La tarifa por hora debe ser mayor a 0';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!/^\+?[\d\s\-\(\)]{8,}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Formato de teléfono inválido';
        }

        if (formData.bio && formData.bio.length > 500) {
            newErrors.bio = 'La biografía no puede exceder 500 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleHourlyRateChange = (value: string) => {
        const sanitizedValue = value.replace(',', '.');
        if (/^\d*(\.\d{0,2})?$/.test(sanitizedValue)) {
            setHourlyRateInput(sanitizedValue);
            const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
            handleInputChange('hourly_rate', numericValue);
        }
    };

    const adjustHourlyRate = (delta: number) => {
        const currentValue = parseFloat(hourlyRateInput || '0');
        const baseValue = Number.isNaN(currentValue) ? 0 : currentValue;
        const nextValue = Math.max(0, baseValue + delta);
        const normalized = nextValue.toFixed(2);
        const trimmedValue = normalized.replace(/\.00$/, '').replace(/\.([1-9])0$/, '.$1');
        setHourlyRateInput(trimmedValue);
        handleInputChange('hourly_rate', parseFloat(normalized));
    };

    const handleHourlyRateKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            adjustHourlyRate(1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            adjustHourlyRate(-1);
        }
    };

    const handleHourlyRateBlur = () => {
        if (hourlyRateInput === '') {
            return;
        }

        const normalized = hourlyRateInput.endsWith('.') ? hourlyRateInput.slice(0, -1) : hourlyRateInput;
        setHourlyRateInput(normalized);
        handleInputChange('hourly_rate', normalized === '' ? 0 : parseFloat(normalized));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            const updateData: UpdateCoachProfileData = {
                bio: formData.bio.trim() || null,
                hourly_rate: formData.hourly_rate,
                is_available: formData.is_available,
                phone: formData.phone.trim(),
            };

            // Actualizar género si cambió
            if (formData.genre !== coachProfile.user.genre) {
                await updateUserData(coachProfile.user_id, { genre: formData.genre });
            }

            const updatedProfile = await updateCoachProfile(coachProfile.id, updateData);
            onProfileUpdate(updatedProfile);

            Swal({
                title: 'Perfil Actualizado',
                text: 'Tu perfil ha sido actualizado exitosamente.',
                icon: 'success',
                timer: 2000,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal({
                title: 'Error',
                text: 'No se pudo actualizar el perfil. Intenta de nuevo.',
                icon: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-content">
            <div className="profile-header">
                <div className="profile-header-content">
                    <h2 className="profile-title">Mi Perfil</h2>
                    <span className="profile-subtitle">Gestiona tu información personal y profesional</span>
                </div>
            </div>

            <div className="profile-layout">
                {/* Información Personal (Solo lectura) */}
                <div className="profile-section">
                    <h4 className="section-title">
                        <i className="bi bi-person"></i>
                        Información Personal
                    </h4>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Nombre Completo</span>
                            <span className="info-value">
                                {coachProfile.user.first_name} {coachProfile.user.last_name}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{coachProfile.user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Fecha de Nacimiento</span>
                            <span className="info-value">{formatDate(coachProfile.user.birthday)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Fecha de Alta</span>
                            <span className="info-value">{formatDate(coachProfile.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Información Profesional (Editable) */}
                <div className="profile-section">
                    <h4 className="section-title">
                        <i className="bi bi-briefcase"></i>
                        Información Profesional
                    </h4>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                placeholder="Ej: +54 9 11 1234-5678"
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="genre" className="form-label">
                                Género *
                            </label>
                            <select id="genre" value={formData.genre} onChange={(e) => handleInputChange('genre', e.target.value)} className="form-input">
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="hourly_rate" className="form-label">
                                Tarifa por Hora (ARS) *
                            </label>
                            <div className="input-with-icon">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="text"
                                    id="hourly_rate"
                                    inputMode="decimal"
                                    value={hourlyRateInput}
                                    onChange={(e) => handleHourlyRateChange(e.target.value)}
                                    onBlur={handleHourlyRateBlur}
                                    onKeyDown={handleHourlyRateKeyDown}
                                    className={`form-input ${errors.hourly_rate ? 'error' : ''}`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.hourly_rate && <span className="error-message">{errors.hourly_rate}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio" className="form-label">
                                Biografía
                            </label>
                            <textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className={`form-textarea ${errors.bio ? 'error' : ''}`}
                                rows={4}
                                placeholder="Cuéntanos sobre tu experiencia, especialidades y metodología de enseñanza..."
                                maxLength={500}
                            />
                            <div className="char-count">{formData.bio.length}/500 caracteres</div>
                            {errors.bio && <span className="error-message">{errors.bio}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Estado de Disponibilidad</label>
                            <div className="availability-toggle">
                                <div className="toggle-content">
                                    <div className="toggle-info">
                                        <i className={`bi ${formData.is_available ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                                        <span className="toggle-status">{formData.is_available ? 'Disponible para nuevas clases' : 'No disponible para nuevas clases'}</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_available}
                                            onChange={(e) => handleInputChange('is_available', e.target.checked)}
                                            className="toggle-input"
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <i className="bi bi-arrow-clockwise spin"></i>
                                        Guardando...
                                    </>
                                ) : (
                                    <>Guardar Cambios</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
