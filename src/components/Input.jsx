// Input Component - R+Cidades
import './Input.css';

const Input = ({
    label,
    error,
    helperText,
    fullWidth = false,
    icon,
    type = 'text',
    ...props
}) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {props.required && <span className="input-required">*</span>}
                </label>
            )}

            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    id={inputId}
                    type={type}
                    className={`input ${error ? 'input--error' : ''} ${icon ? 'input--with-icon' : ''}`}
                    {...props}
                />
            </div>

            {error && <span className="input-error-message">{error}</span>}
            {helperText && !error && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
};

export default Input;
