// Arquivo: src/components/Toast.jsx
import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__icon">{icons[type]}</div>
            <p className="toast__message">{message}</p>
            <button className="toast__close" onClick={onClose}>×</button>
        </div>
    );
}

export default Toast;
