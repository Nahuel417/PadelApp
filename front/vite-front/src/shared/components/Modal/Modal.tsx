import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    showCloseButton?: boolean;
    className?: string;
    contentClassName?: string;
    closeOnOverlayClick?: boolean;
}

const MODAL_ROOT_ID = 'modal-root';

const ensurePortalContainer = (): HTMLElement | null => {
    if (typeof document === 'undefined') return null;

    let container = document.getElementById(MODAL_ROOT_ID);
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', MODAL_ROOT_ID);
        document.body.appendChild(container);
    }

    return container;
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    showCloseButton = true,
    className,
    contentClassName,
    closeOnOverlayClick = true,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const portalContainer = useMemo(() => ensurePortalContainer(), []);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const focusable = dialogRef.current?.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [handleClose, isOpen]);

    if (!isOpen || !portalContainer) {
        return null;
    }

    const handleOverlayClick = () => {
        if (closeOnOverlayClick) {
            handleClose();
        }
    };

    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return createPortal(
        <div className={`modal-overlay ${className ?? ''}`} onClick={handleOverlayClick} role="presentation">
            <div
                ref={dialogRef}
                className={`modal-container modal-container--${size} ${contentClassName ?? ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                aria-describedby={description ? 'modal-description' : undefined}
                onClick={handleDialogClick}
            >
                {(title || showCloseButton) && (
                    <header className="modal-header">
                        {title && (
                            <h2 id="modal-title" className="modal-title">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button type="button" className="modal-close-button" onClick={handleClose} aria-label="Cerrar">
                                <i className="bi bi-x-lg" aria-hidden="true"></i>
                            </button>
                        )}
                    </header>
                )}

                {description && (
                    <p id="modal-description" className="modal-description">
                        {description}
                    </p>
                )}

                <div className="modal-body">{children}</div>

                {footer && <footer className="modal-footer">{footer}</footer>}
            </div>
        </div>,
        portalContainer
    );
};

export default Modal;
