// Button Component - R+Cidades
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    ...props
}) => {
    const classNames = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        disabled && 'btn--disabled',
        loading && 'btn--loading',
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <span className="btn__spinner"></span>
                    <span className="btn__text">{children}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
