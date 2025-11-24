// Arquivo: src/pages/BancosDeMateriais.jsx
import { useState, useEffect } from 'react';
import { api } from '../config/api';
import { Card, Loading, Button } from '../components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './BancosDeMateriais.css';

function BancosDeMateriais() {
    const [bancos, setBancos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        carregarBancos();
    }, []);

    const carregarBancos = async () => {
        try {
            const data = await api.get('/bancos-materiais');
            setBancos(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar bancos:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bancos-container">
            <div className="bancos-header">
                <div>
                    <h2>Bancos de Materiais</h2>
                    <p className="subtitle">Locais físicos onde você pode doar ou retirar materiais.</p>
                </div>
                {token && (
                    <Button onClick={() => navigate('/criar-banco')}>
                        + Cadastrar Novo Banco
                    </Button>
                )}
            </div>

            {bancos.length === 0 ? (
                <Card className="empty-state">
                    <p>Nenhum banco de materiais cadastrado ainda.</p>
                </Card>
            ) : (
                <div className="bancos-grid">
                    {bancos.map(banco => (
                        <Card key={banco.id} className="banco-card">
                            <h3>{banco.nome}</h3>
                            <div className="banco-info">
                                <p><strong>Endereço:</strong> {banco.endereco}</p>
                                {banco.telefone && <p><strong>Telefone:</strong> {banco.telefone}</p>}
                                {banco.responsavel && (
                                    <p><strong>Responsável:</strong> {banco.responsavel.name}</p>
                                )}
                            </div>
                            <div className="banco-actions">
                                <Button variant="secondary" size="small">Ver Estoque</Button>
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={() => window.open(`https://maps.google.com/?q=${banco.endereco}`, '_blank')}
                                >
                                    Ver no Mapa
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BancosDeMateriais;
