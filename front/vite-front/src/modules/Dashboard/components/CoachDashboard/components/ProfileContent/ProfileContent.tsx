import React, { useState } from 'react';
import { CoachProfile, updateCoachProfile, UpdateCoachProfileData } from '../../../../../../services/coachServices';
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
}

interface FormErrors {
    bio?: string;
    hourly_rate?: string;
    phone?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    coachProfile,
    onProfileUpdate
}) => {
    const [formData, setFormData] = useState<FormData>({
        bio: coachProfile.bio || '',
        hourly_rate: coachProfile.hourly_rate || 0,
        is_available: coachProfile.is_available,
        phone: coachProfile.phone || ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
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

        try {
            setIsLoading(true);

            const updateData: UpdateCoachProfileData = {
                bio: formData.bio.trim() || null,
                hourly_rate: formData.hourly_rate,
                is_available: formData.is_available,
                phone: formData.phone.trim()
            };

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
                <h3 className="profile-title">Mi Perfil</h3>
                <p className="profile-subtitle">Gestiona tu información personal y profesional</p>
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
                            <span className="info-label">Género</span>
                            <span className="info-value">
                                {coachProfile.user.genre.charAt(0).toUpperCase() + coachProfile.user.genre.slice(1)}
                            </span>
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
                            <label htmlFor="hourly_rate" className="form-label">
                                Tarifa por Hora (ARS) *
                            </label>
                            <input
                                type="number"
                                id="hourly_rate"
                                value={formData.hourly_rate}
                                onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                                className={`form-input ${errors.hourly_rate ? 'error' : ''}`}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
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
                            <div className="char-count">
                                {formData.bio.length}/500 caracteres
                            </div>
                            {errors.bio && <span className="error-message">{errors.bio}</span>}
                        </div>

                        <div className="form-group">
                            <div className="availability-toggle">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_available}
                                        onChange={(e) => handleInputChange('is_available', e.target.checked)}
                                        className="toggle-input"
                                    />
                                    <span className="toggle-slider"></span>
                                    <span className="toggle-text">
                                        {formData.is_available ? 'Disponible para nuevas clases' : 'No disponible para nuevas clases'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-save"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="bi bi-arrow-clockwise spin"></i>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Guardar Cambios
                                    </>
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
