// Arquivo: src/components/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-brand">R+Cidades</h3>
                    <p>
                        Transformando resíduos da construção civil em recursos para quem precisa.
                        Conectando doadores e beneficiários para um futuro mais sustentável.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Links Rápidos</h4>
                    <ul>
                        <li><Link to="/">Catálogo de Materiais</Link></li>
                        <li><Link to="/bancos-materiais">Bancos de Materiais</Link></li>
                        <li><Link to="/login">Entrar</Link></li>
                        <li><Link to="/register">Cadastrar</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contato</h4>
                    <ul>
                        <li><a href="mailto:contato@rcidades.com.br">contato@rcidades.com.br</a></li>
                        <li><span className="fake-link">Suporte Técnico</span></li>
                        <li><span className="fake-link">Termos de Uso</span></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} R+Cidades. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
