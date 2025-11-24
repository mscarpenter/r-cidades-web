// Arquivo: src/pages/MeusAnuncios.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../config/api';
import { Button, Card, Loading, Toast, Modal } from '../components';
import './MeusAnuncios.css';

function MeusAnuncios() {
    const { token } = useAuth();
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(null);
    const [modalSolicitacoes, setModalSolicitacoes] = useState(null);

    useEffect(() => {
        carregarAnuncios();
    }, []);

    const carregarAnuncios = async () => {
        try {
            const data = await api.get('/meus-anuncios', token);
            setAnuncios(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar anúncios:', error);
            setToast({ type: 'error', message: 'Erro ao carregar seus anúncios.' });
            setLoading(false);
        }
    };

    const handleExcluir = async (id) => {
        try {
            await api.delete(`/anuncios/${id}`, token);
            setToast({ type: 'success', message: 'Anúncio cancelado com sucesso!' });
            setModalExcluir(null);
            carregarAnuncios();
        } catch (error) {
            console.error('Erro ao excluir anúncio:', error);
            setToast({ type: 'error', message: 'Erro ao cancelar anúncio.' });
        }
    };

    const handleAprovar = async (solicitacaoId) => {
        try {
            await api.post(`/solicitacoes/${solicitacaoId}/aprovar`);
            setToast({ type: 'success', message: 'Solicitação aprovada! O beneficiário será notificado.' });
            setModalSolicitacoes(null);
            carregarAnuncios();
        } catch (error) {
            console.error('Erro ao aprovar:', error);
            setToast({ type: 'error', message: 'Erro ao aprovar solicitação.' });
        }
    };

    const handleRejeitar = async (solicitacaoId) => {
        try {
            await api.post(`/solicitacoes/${solicitacaoId}/rejeitar`);
            setToast({ type: 'success', message: 'Solicitação rejeitada.' });
            setModalSolicitacoes(null);
            carregarAnuncios();
        } catch (error) {
            console.error('Erro ao rejeitar:', error);
            setToast({ type: 'error', message: 'Erro ao rejeitar solicitação.' });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            disponivel: { class: 'status-disponivel', text: 'Disponível' },
            reservado: { class: 'status-reservado', text: 'Reservado' },
            doado: { class: 'status-doado', text: 'Doado' },
            cancelado: { class: 'status-cancelado', text: 'Cancelado' },
        };

        const badge = badges[status] || badges.disponivel;
        return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="meus-anuncios-container">
            <div className="header">
                <h2>Meus Anúncios</h2>
                <Link to="/criar-anuncio">
                    <Button>+ Novo Anúncio</Button>
                </Link>
            </div>

            {anuncios.length === 0 ? (
                <Card className="empty-state">
                    <p>Você ainda não criou nenhum anúncio.</p>
                    <Link to="/criar-anuncio">
                        <Button>Criar Primeiro Anúncio</Button>
                    </Link>
                </Card>
            ) : (
                <div className="anuncios-grid">
                    {anuncios.map(anuncio => (
                        <Card key={anuncio.id} className="anuncio-card">
                            <div className="anuncio-header">
                                <h3>{anuncio.titulo}</h3>
                                {getStatusBadge(anuncio.status)}
                            </div>

                            <p className="anuncio-descricao">{anuncio.descricao}</p>

                            <div className="anuncio-info">
                                <div className="info-item">
                                    <strong>Quantidade:</strong> {anuncio.quantidade}
                                </div>
                                <div className="info-item">
                                    <strong>Condição:</strong> {anuncio.condicao}
                                </div>
                                {anuncio.peso_estimado_kg && (
                                    <div className="info-item">
                                        <strong>Peso:</strong> {anuncio.peso_estimado_kg} kg
                                    </div>
                                )}
                            </div>

                            {anuncio.solicitacoes && anuncio.solicitacoes.length > 0 && (
                                <div className="solicitacoes-section">
                                    <div className="solicitacoes-badge">
                                        {anuncio.solicitacoes.length} interessado(s)
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={() => setModalSolicitacoes(anuncio)}
                                    >
                                        Gerenciar Solicitações
                                    </Button>
                                </div>
                            )}

                            <div className="anuncio-actions">
                                <Link to={`/anuncio/${anuncio.id}`}>
                                    <Button variant="secondary" size="small">Ver Detalhes</Button>
                                </Link>

                                {anuncio.status === 'disponivel' && (
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => setModalExcluir(anuncio)}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de Gerenciar Solicitações */}
            {modalSolicitacoes && (
                <Modal
                    title={`Solicitações para "${modalSolicitacoes.titulo}"`}
                    onClose={() => setModalSolicitacoes(null)}
                >
                    <div className="lista-solicitacoes">
                        {modalSolicitacoes.solicitacoes.length === 0 ? (
                            <p>Nenhuma solicitação pendente.</p>
                        ) : (
                            modalSolicitacoes.solicitacoes.map(solicitacao => (
                                <div key={solicitacao.id} className="solicitacao-item">
                                    <div className="solicitacao-info">
                                        <p><strong>Beneficiário:</strong> {solicitacao.beneficiario?.name || 'Usuário'}</p>
                                        <p><strong>Status:</strong> {solicitacao.status}</p>
                                        <p className="solicitacao-msg">"{solicitacao.mensagem}"</p>
                                    </div>
                                    {solicitacao.status === 'pendente' && (
                                        <div className="solicitacao-actions">
                                            <Button
                                                size="small"
                                                onClick={() => handleAprovar(solicitacao.id)}
                                            >
                                                Aprovar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="small"
                                                onClick={() => handleRejeitar(solicitacao.id)}
                                            >
                                                Rejeitar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </Modal>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {modalExcluir && (
                <Modal
                    title="Cancelar Anúncio"
                    onClose={() => setModalExcluir(null)}
                >
                    <p>Tem certeza que deseja cancelar o anúncio "{modalExcluir.titulo}"?</p>
                    <p className="warning-text">Esta ação não pode ser desfeita.</p>

                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setModalExcluir(null)}>
                            Não, manter
                        </Button>
                        <Button variant="danger" onClick={() => handleExcluir(modalExcluir.id)}>
                            Sim, cancelar anúncio
                        </Button>
                    </div>
                </Modal>
            )}

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

export default MeusAnuncios;
