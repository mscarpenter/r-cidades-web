// Arquivo: src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    R+Cidades
                </Link>

                {/* Botão Mobile (Hambúrguer) */}
                <button className="navbar-toggle" onClick={toggleMenu} aria-label="Menu">
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                </button>

                {/* Links de Navegação */}
                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeMenu}>Catálogo</Link>
                    <Link to="/bancos-materiais" onClick={closeMenu}>Bancos de Materiais</Link>

                    {token ? (
                        <>
                            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                            <Link to="/criar-anuncio" className="btn-highlight" onClick={closeMenu}>
                                + Anunciar
                            </Link>

                            {/* Dropdown Desktop / Lista Mobile */}
                            <div className="user-menu">
                                <button
                                    className="user-menu-btn"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    Olá, {user?.name?.split(' ')[0] || 'Usuário'} ▼
                                </button>

                                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                    <Link to="/perfil" onClick={() => { setIsDropdownOpen(false); closeMenu(); }}>Meu Perfil</Link>
                                    <Link to="/meus-anuncios" onClick={() => { setIsDropdownOpen(false); closeMenu(); }}>Meus Anúncios</Link>
                                    <Link to="/minhas-solicitacoes" onClick={() => { setIsDropdownOpen(false); closeMenu(); }}>Minhas Solicitações</Link>
                                    <Link to="/agendamentos" onClick={() => { setIsDropdownOpen(false); closeMenu(); }}>Logística</Link>
                                    <button onClick={handleLogout} className="logout-btn">Sair</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login" onClick={closeMenu}>Entrar</Link>
                            <Link to="/register" className="btn-register" onClick={closeMenu}>Cadastrar</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
