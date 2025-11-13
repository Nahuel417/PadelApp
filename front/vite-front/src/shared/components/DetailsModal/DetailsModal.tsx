import React, { ReactNode } from 'react';
import { Modal } from '../Modal/Modal';
import './DetailsModal.css';

export interface DetailItem {
    label: string;
    value: string | ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export interface DetailSection {
    title: string;
    icon: string;
    items: DetailItem[];
    customContent?: ReactNode;
}

export interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    headerIcon?: string;
    statusBadge?: {
        text: string;
        className: string;
        icon?: string;
    };
    summaryCard?: {
        avatar?: string;
        title: string;
        subtitle: string;
        extraInfo?: ReactNode;
    };
    sections: DetailSection[];
    footer?: ReactNode;
    isLoading?: boolean;
    loadingText?: string;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    headerIcon,
    statusBadge,
    summaryCard,
    sections,
    footer,
    isLoading = false,
    loadingText = 'Cargando...',
}) => {
    const renderDetailItem = (item: DetailItem, index: number) => (
        <div key={index} className={`detail-item ${item.fullWidth ? 'full-width' : ''} ${item.className || ''}`}>
            <span className="detail-label">{item.label}</span>
            <div className="detail-value">{typeof item.value === 'string' ? item.value : item.value}</div>
        </div>
    );

    const renderSection = (section: DetailSection, index: number) => (
        <div key={index} className="details-section details-section-card">
            <h3 className="details-section-title">
                <i className={`bi ${section.icon}`}></i>
                {section.title}
            </h3>

            {section.customContent ? section.customContent : <div className="details-grid">{section.items.map(renderDetailItem)}</div>}
        </div>
    );

    const modalContent = (
        <>
            {/* Header personalizado */}
            <div className="details-modal-header">
                <div className="details-header-left">
                    {headerIcon && (
                        <div className="details-header-icon">
                            <i className={`bi ${headerIcon}`}></i>
                        </div>
                    )}
                    <div className="details-header-text">
                        <h2>{title}</h2>
                        {subtitle && <p className="details-header-subtitle">{subtitle}</p>}
                    </div>
                </div>
                <div className="details-header-actions">
                    {statusBadge && (
                        <span className={`details-status-badge ${statusBadge.className}`}>
                            {statusBadge.icon && <i className={`bi ${statusBadge.icon}`}></i>}
                            {statusBadge.text}
                        </span>
                    )}
                </div>
            </div>

            {/* Contenido principal */}
            <div className="details-modal-body">
                {/* Tarjeta de resumen */}
                {summaryCard && (
                    <div className="details-summary-card">
                        <div className="summary-avatar">
                            <span>{summaryCard.avatar}</span>
                        </div>
                        <div className="summary-info">
                            <h3>{summaryCard.title}</h3>
                            <p>{summaryCard.subtitle}</p>
                            {summaryCard.extraInfo}
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                    <div className="details-loading">
                        <i className="bi bi-arrow-clockwise spin"></i>
                        {loadingText}
                    </div>
                ) : (
                    /* Secciones de detalles */
                    sections.map(renderSection)
                )}
            </div>
        </>
    );

    const modalFooter = footer ? (
        <div className="details-modal-footer">{footer}</div>
    ) : (
        <div className="details-modal-footer">
            <button className="btn-close" onClick={onClose}>
                <i className="bi bi-x-circle"></i>
                <span>Cerrar</span>
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false} className="details-modal-wrapper" contentClassName="details-modal-content" footer={modalFooter}>
            {modalContent}
        </Modal>
    );
};

export default DetailsModal;
