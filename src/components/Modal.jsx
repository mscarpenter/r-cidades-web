// Modal Component - R+Cidades
import { useEffect } from 'react';
import './Modal.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdropClick = true,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal modal--${size}`} role="dialog" aria-modal="true">
                <div className="modal__header">
                    {title && <h2 className="modal__title">{title}</h2>}
                    <button
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>

                <div className="modal__body">
                    {children}
                </div>

                {footer && (
                    <div className="modal__footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
