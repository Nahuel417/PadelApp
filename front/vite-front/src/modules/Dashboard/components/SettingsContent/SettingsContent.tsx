import React, { useState, useEffect } from 'react';
import './SettingsContent.css';
import { SettingsHeader } from './components/SettingsHeader/SettingsHeader';
import { useUserStore } from '../../../../store/userStore';
import { supabase } from '../../../../services/supabaseClient';
import Swal from 'sweetalert';
import { UserRole } from '../../../../utils/enums/roles.enum';

const SettingsContent: React.FC = () => {
    const user = useUserStore((state) => state.userActive);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [loading, setLoading] = useState(false);

    const [initialFormData, setInitialFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        genre: 'otro',
        birthday: '',
    });

    // Profile State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        genre: 'otro',
        birthday: '',
    });

    // Security State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [currentPasswordStatus, setCurrentPasswordStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

    const [userMeta, setUserMeta] = useState({
        role: 'Usuario',
        status: 'Activo',
        createdAt: new Date().toISOString(),
    });

    const isProfileModified = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    const isProfileComplete = formData.first_name.trim() !== '' && formData.last_name.trim() !== '';

    // Password Validation Logic
    const hasMinLength = passwordData.newPassword.length >= 8;
    const hasNumber = /\d/.test(passwordData.newPassword);
    const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;
    const isDifferentFromCurrent = passwordData.currentPassword !== passwordData.newPassword;

    const isPasswordValid = currentPasswordStatus === 'valid' && hasMinLength && hasNumber && passwordsMatch && isDifferentFromCurrent;

    const getRoleLabel = (roleId: number) => {
        switch (roleId) {
            case UserRole.SUPERADMIN:
                return 'Super Admin';
            case UserRole.ADMIN:
                return 'Administrador';
            case UserRole.COACH:
                return 'Entrenador';
            case UserRole.USER:
                return 'Usuario';
            default:
                return 'Usuario';
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

            if (error) throw error;

            if (data) {
                const userData = {
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    genre: data.genre || 'otro',
                    birthday: data.birthday || '',
                };
                setFormData(userData);
                setInitialFormData(userData);

                // Obtener el rol numérico (role_id) y mapearlo
                const roleId = (data as any).role_id || (user as any).role_id;
                const roleLabel = roleId ? getRoleLabel(Number(roleId)) : 'Usuario';

                // Actualizar metadatos del usuario desde la DB
                setUserMeta({
                    role: roleLabel,
                    status: (data as any).status || 'Activo',
                    createdAt: data.created_at || user.created_at || new Date().toISOString(),
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal('Error', 'No se pudieron cargar los datos del usuario', 'error');
        } finally {
            setLoading(false);
        }
    };

    const validateCurrentPassword = async () => {
        if (!passwordData.currentPassword) {
            setCurrentPasswordStatus('idle');
            return;
        }

        // Evitar re-validar si no ha cambiado (opcional, por ahora simple)
        setCurrentPasswordStatus('validating');

        const { error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: passwordData.currentPassword,
        });

        if (error) {
            setCurrentPasswordStatus('invalid');
        } else {
            setCurrentPasswordStatus('valid');
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isProfileModified || !isProfileComplete) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    genre: formData.genre,
                    birthday: formData.birthday,
                })
                .eq('id', user.id);

            if (error) throw error;

            setInitialFormData(formData);
            Swal('Éxito', 'Perfil actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal('Error', 'No se pudo actualizar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        setLoading(true);
        try {
            // Ya validamos la actual onBlur, pero por seguridad...
            if (currentPasswordStatus !== 'valid') {
                // Re-validar si por alguna razón se saltó
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: passwordData.currentPassword,
                });
                if (signInError) {
                    setCurrentPasswordStatus('invalid');
                    setLoading(false);
                    return;
                }
            }

            // 2. Actualizar contraseña
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordData.newPassword,
            });

            if (updateError) throw updateError;

            Swal('Éxito', 'Contraseña actualizada correctamente', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setCurrentPasswordStatus('idle');
        } catch (error) {
            console.error('Error updating password:', error);
            Swal('Error', 'No se pudo actualizar la contraseña', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-content">
            <SettingsHeader title="Configuración de Cuenta" userRole={userMeta.role} email={formData.email} joinDate={userMeta.createdAt} />

            <div className="settings-container">
                <div className="settings-tabs">
                    <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <i className="bi bi-person"></i>
                        Mi Perfil
                    </button>
                    <button className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                        <i className="bi bi-shield-lock"></i>
                        Seguridad
                    </button>
                </div>

                <div className="settings-panel">
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileUpdate} className="settings-form">
                            <h3 className="settings-section-title">Información Personal</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Apellido</label>
                                    <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={formData.email} disabled className="input-disabled" />
                                    <span className="helper-text">El email no se puede modificar</span>
                                </div>
                                <div className="form-group">
                                    <label>Género</label>
                                    <select value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })}>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Nacimiento</label>
                                    <input type="date" value={formData.birthday} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save" disabled={loading || !isProfileModified || !isProfileComplete}>
                                    {loading ? (
                                        <>
                                            <div className="btn-spinner"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordUpdate} className="settings-form full-width">
                            <h3 className="settings-section-title">Cambiar Contraseña</h3>

                            <div className="security-layout">
                                <div className="security-form-column">
                                    <div className="form-group">
                                        <label>Contraseña Actual</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                onBlur={validateCurrentPassword}
                                                className={currentPasswordStatus === 'invalid' ? 'input-error' : currentPasswordStatus === 'valid' ? 'input-success' : ''}
                                                required
                                            />
                                            {currentPasswordStatus === 'validating' && <div className="input-spinner"></div>}
                                            {currentPasswordStatus === 'valid' && <i className="bi bi-check-circle-fill input-icon success"></i>}
                                            {currentPasswordStatus === 'invalid' && <i className="bi bi-x-circle-fill input-icon error"></i>}
                                        </div>
                                        {currentPasswordStatus === 'invalid' && <span className="error-text">La contraseña actual es incorrecta</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                        {passwordData.confirmPassword && !passwordsMatch && <span className="error-text">Las contraseñas no coinciden</span>}
                                    </div>
                                </div>

                                <div className="security-info-column">
                                    <div className="requirements-card">
                                        <h4>Requisitos de seguridad</h4>
                                        {passwordData.newPassword ? (
                                            <ul className="password-requirements">
                                                <li className={hasMinLength ? 'valid' : 'invalid'}>
                                                    <i className={`bi ${hasMinLength ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Mínimo 8 caracteres
                                                </li>
                                                <li className={hasNumber ? 'valid' : 'invalid'}>
                                                    <i className={`bi ${hasNumber ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Al menos un número
                                                </li>
                                                <li className={isDifferentFromCurrent ? 'valid' : 'invalid'}>
                                                    <i className={`bi ${isDifferentFromCurrent ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Diferente a la actual
                                                </li>
                                            </ul>
                                        ) : (
                                            <p className="requirements-hint">Ingresa tu contraseña actual para poder modificarla.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save" disabled={loading || !isPasswordValid}>
                                    {loading ? (
                                        <>
                                            <div className="btn-spinner"></div>
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Actualizar Contraseña'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsContent;
