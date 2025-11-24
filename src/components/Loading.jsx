// Arquivo: src/components/Loading.jsx
import './Loading.css';

function Loading({ message = 'Carregando...' }) {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">{message}</p>
        </div>
    );
}

export default Loading;
