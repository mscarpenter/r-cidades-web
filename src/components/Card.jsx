// Card Component - R+Cidades
import './Card.css';

const Card = ({
    children,
    title,
    subtitle,
    footer,
    hoverable = false,
    onClick,
    className = '',
    ...props
}) => {
    const classNames = [
        'card',
        hoverable && 'card--hoverable',
        onClick && 'card--clickable',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} onClick={onClick} {...props}>
            {(title || subtitle) && (
                <div className="card__header">
                    {title && <h3 className="card__title">{title}</h3>}
                    {subtitle && <p className="card__subtitle">{subtitle}</p>}
                </div>
            )}

            <div className="card__body">
                {children}
            </div>

            {footer && (
                <div className="card__footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
