import React, { useEffect, useMemo, useState } from 'react';
import './UserManagementModal.css';
import { Modal, FilterChips, Spinner, Pagination, InfoNote } from '../../../../../../shared';
import { UserManagementModalProps, DashboardManageableRole } from '../../types/types';
import { getRoleLabel } from '../../utils/userUtils';

const buildRoleOptions = (roles: DashboardManageableRole[]) => roles.map((role) => ({ value: role, label: getRoleLabel(role) }));

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
    isOpen,
    user,
    availableRoles,
    onClose,
    onChangeRole,
    isUpdatingRole,
    updateError,
    reservations,
    isLoadingReservations,
    reservationsError,
    onReloadReservations,
    reservationsPage,
    reservationsHasNextPage,
    onReservationsPageChange,
    hasLoadedReservations,
    onLoadReservations,
}) => {
    const [selectedRole, setSelectedRole] = useState<DashboardManageableRole | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const roleOptions = useMemo(() => buildRoleOptions(availableRoles), [availableRoles]);

    useEffect(() => {
        if (!isOpen || !user) {
            setSelectedRole(null);
            return;
        }

        if (availableRoles.includes(user.role as DashboardManageableRole)) {
            setSelectedRole(user.role as DashboardManageableRole);
        } else {
            setSelectedRole(availableRoles[0] ?? null);
        }
    }, [availableRoles, isOpen, user]);

    useEffect(() => {
        if (!isUpdatingRole) {
            setIsSubmitting(false);
        }
    }, [isUpdatingRole]);

    if (!user) {
        return null;
    }

    const currentRoleLabel = getRoleLabel(user.role);
    const handleRoleSelect = (role: string) => {
        setSelectedRole(role as DashboardManageableRole);
    };

    const handleUpdateRole = async () => {
        if (!selectedRole || selectedRole === user.role) return;
        setIsSubmitting(true);
        await onChangeRole(selectedRole);
        setIsSubmitting(false);
    };

    const footer = (
        <div className="user-management-footer">
            {updateError && <span className="user-management-error">{updateError}</span>}
            <button type="button" className="user-management-cancel" onClick={onClose} disabled={isSubmitting || isUpdatingRole}>
                Cerrar
            </button>
            <button
                type="button"
                className="user-management-confirm"
                onClick={handleUpdateRole}
                disabled={!selectedRole || selectedRole === (user.role as DashboardManageableRole) || isSubmitting || isUpdatingRole}>
                {isUpdatingRole ? 'Actualizando...' : 'Actualizar rol'}
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Gestionar ${user.fullName}`} description={`Rol actual: ${currentRoleLabel}`} size="lg" footer={footer}>
            <div className="user-management-modal">
                <section className="user-management-section">
                    <h3 className="user-management-section-title">Resumen del perfil</h3>
                    <div className="user-management-profile">
                        <div>
                            <span className="profile-label">Nombre completo</span>
                            <span className="profile-value">{user.fullName}</span>
                        </div>
                        <div>
                            <span className="profile-label">Correo electrónico</span>
                            <span className="profile-value">{user.email || 'Sin email'}</span>
                        </div>
                        <div>
                            <span className="profile-label">Rol actual</span>
                            <span className="profile-chip">{currentRoleLabel}</span>
                        </div>
                    </div>
                    {user.role === 'superadmin' && (
                        <p className="user-management-alert">Este usuario es Superadmin. Podrás asignar únicamente roles de Usuario, Entrenador o Administrador.</p>
                    )}
                </section>

                <section className="user-management-section">
                    <div className="section-header">
                        <h3>Actualizar rol</h3>
                        <span className="section-caption">Seleccioná un rol y confirmá para aplicar los cambios.</span>
                    </div>
                    <FilterChips selectedValue={selectedRole ?? ''} onChange={handleRoleSelect} options={roleOptions} />
                </section>

                <section className="user-management-section">
                    <div className="section-header">
                        <h3>Historial reciente</h3>
                        <div className="section-actions">
                            <button type="button" className="link-button" onClick={onReloadReservations} disabled={isLoadingReservations || !hasLoadedReservations}>
                                {isLoadingReservations ? 'Actualizando…' : 'Refrescar'}
                            </button>
                        </div>
                    </div>
                    <InfoNote>Usá “Refrescar” para ver las reservas más recientes después de realizar cambios.</InfoNote>
                    {!hasLoadedReservations ? (
                        <div className="user-management-reservations-placeholder">
                            {isLoadingReservations ? (
                                <div className="user-management-spinner">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <p className="user-management-placeholder-text">Haz click en el boton para cargar el historial.</p>
                                    <button type="button" className="user-management-trigger" onClick={onLoadReservations}>
                                        Ver historial
                                    </button>
                                </>
                            )}
                        </div>
                    ) : isLoadingReservations ? (
                        <div className="user-management-spinner">
                            <Spinner />
                        </div>
                    ) : reservationsError ? (
                        <div className="user-management-error-block">{reservationsError}</div>
                    ) : reservations.length === 0 ? (
                        <div className="user-management-empty">No hay reservas registradas.</div>
                    ) : (
                        <>
                            <ul className="user-management-reservations">
                                {reservations.map((reservation) => (
                                    <li key={reservation.id} className="user-management-reservation">
                                        <div>
                                            <span className="reservation-date">{reservation.dateLabel}</span>
                                            <span className="reservation-time">{reservation.timeRange}</span>
                                        </div>
                                        <div className="reservation-meta">
                                            <span className="reservation-court">{reservation.courtName}</span>
                                            {reservation.counterpartName && <span className="reservation-counterpart">Con: {reservation.counterpartName}</span>}
                                        </div>
                                        <span className={`reservation-status reservation-status--${reservation.status.toLowerCase()}`}>{reservation.status}</span>
                                    </li>
                                ))}
                            </ul>

                            {(reservationsHasNextPage || reservationsPage > 1) && (
                                <div className="user-management-pagination">
                                    <Pagination currentPage={reservationsPage} hasNextPage={reservationsHasNextPage} onPageChange={onReservationsPageChange} />
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </Modal>
    );
};

export default UserManagementModal;
