// Arquivo: src/pages/MinhasSolicitacoes.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../config/api';
import { Button, Card, Loading, Toast, Modal } from '../components';
import './MinhasSolicitacoes.css';

function MinhasSolicitacoes() {
    const { token } = useAuth();
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [modalCancelar, setModalCancelar] = useState(null);

    useEffect(() => {
        carregarSolicitacoes();
    }, []);

    const carregarSolicitacoes = async () => {
        try {
            const data = await api.get('/minhas-solicitacoes', token);
            setSolicitacoes(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            setToast({ type: 'error', message: 'Erro ao carregar suas solicitações.' });
            setLoading(false);
        }
    };

    const handleCancelar = async (id) => {
        try {
            await api.patch(`/solicitacoes/${id}/cancelar`, {}, token);
            setToast({ type: 'success', message: 'Solicitação cancelada com sucesso!' });
            setModalCancelar(null);
            carregarSolicitacoes();
        } catch (error) {
            console.error('Erro ao cancelar solicitação:', error);
            setToast({ type: 'error', message: 'Erro ao cancelar solicitação.' });
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pendente: { class: 'status-pendente', text: 'Pendente', icon: '⏳' },
            aprovada: { class: 'status-aprovada', text: 'Aprovada', icon: '✅' },
            rejeitada: { class: 'status-rejeitada', text: 'Rejeitada', icon: '❌' },
            cancelada: { class: 'status-cancelada', text: 'Cancelada', icon: '🚫' },
        };

        return statusMap[status] || statusMap.pendente;
    };

    const formatData = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="minhas-solicitacoes-container">
            <h2>Minhas Solicitações</h2>

            {solicitacoes.length === 0 ? (
                <Card className="empty-state">
                    <p>Você ainda não fez nenhuma solicitação.</p>
                    <Link to="/">
                        <Button>Ver Catálogo de Materiais</Button>
                    </Link>
                </Card>
            ) : (
                <div className="solicitacoes-list">
                    {solicitacoes.map(solicitacao => {
                        const statusInfo = getStatusInfo(solicitacao.status);

                        return (
                            <Card key={solicitacao.id} className="solicitacao-card">
                                <div className="solicitacao-header">
                                    <div>
                                        <h3>{solicitacao.anuncio.titulo}</h3>
                                        <p className="doador-info">
                                            Doador: <strong>{solicitacao.anuncio.usuario.name}</strong>
                                        </p>
                                    </div>
                                    <span className={`status-badge ${statusInfo.class}`}>
                                        {statusInfo.icon} {statusInfo.text}
                                    </span>
                                </div>

                                <div className="solicitacao-body">
                                    <div className="info-section">
                                        <strong>Sua justificativa:</strong>
                                        <p className="justificativa">{solicitacao.justificativa_beneficiario}</p>
                                    </div>

                                    {solicitacao.mensagem_doador && (
                                        <div className="info-section mensagem-doador">
                                            <strong>Mensagem do doador:</strong>
                                            <p>{solicitacao.mensagem_doador}</p>
                                        </div>
                                    )}

                                    <div className="solicitacao-meta">
                                        <span>Solicitado em: {formatData(solicitacao.created_at)}</span>
                                    </div>
                                </div>

                                <div className="solicitacao-actions">
                                    <Link to={`/anuncio/${solicitacao.anuncio.id}`}>
                                        <Button variant="secondary" size="small">Ver Anúncio</Button>
                                    </Link>

                                    {solicitacao.status === 'pendente' && (
                                        <Button
                                            variant="danger"
                                            size="small"
                                            onClick={() => setModalCancelar(solicitacao)}
                                        >
                                            Cancelar Solicitação
                                        </Button>
                                    )}

                                    {solicitacao.status === 'aprovada' && (
                                        <div className="aprovada-message">
                                            <span className="success-icon">🎉</span>
                                            <span>Parabéns! Sua solicitação foi aprovada!</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Modal de Confirmação de Cancelamento */}
            {modalCancelar && (
                <Modal
                    title="Cancelar Solicitação"
                    onClose={() => setModalCancelar(null)}
                >
                    <p>Tem certeza que deseja cancelar esta solicitação?</p>
                    <p className="anuncio-titulo">Anúncio: "{modalCancelar.anuncio.titulo}"</p>

                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setModalCancelar(null)}>
                            Não, manter
                        </Button>
                        <Button variant="danger" onClick={() => handleCancelar(modalCancelar.id)}>
                            Sim, cancelar
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Toast de Notificação */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default MinhasSolicitacoes;
