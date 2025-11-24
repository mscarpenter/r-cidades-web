// Arquivo: src/pages/Agendamentos.jsx
import { useState, useEffect } from 'react';
import { api } from '../config/api';
import { Card, Loading, Button, Toast, Input } from '../components';
import './Agendamentos.css';

function Agendamentos() {
    const [solicitacoesAprovadas, setSolicitacoesAprovadas] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Estado para o modal de agendamento
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [dataAgendamento, setDataAgendamento] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            // Carrega solicitações e agendamentos em paralelo
            const [solicitacoesData, agendamentosData] = await Promise.all([
                api.get('/minhas-solicitacoes'),
                api.get('/agendamentos')
            ]);

            // Filtra apenas as aprovadas que NÃO têm agendamento
            const aprovadasPendentes = solicitacoesData.filter(
                s => s.status === 'aprovada' && !s.agendamento
            );

            setSolicitacoesAprovadas(aprovadasPendentes);
            setAgendamentos(agendamentosData);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setLoading(false);
        }
    };

    const handleAgendar = async (e) => {
        e.preventDefault();
        if (!selectedSolicitacao || !dataAgendamento) return;

        try {
            await api.post('/agendamentos', {
                solicitacao_id: selectedSolicitacao.id,
                data_agendada: dataAgendamento
            });

            setToast({ type: 'success', message: 'Retirada agendada com sucesso!' });
            setSelectedSolicitacao(null);
            setDataAgendamento('');
            carregarDados(); // Recarrega a lista
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Erro ao agendar.' });
        }
    };

    const handleConfirmarRetirada = async (agendamentoId) => {
        try {
            await api.put(`/agendamentos/${agendamentoId}`, {
                confirmacao_retirada: true
            });
            setToast({ type: 'success', message: 'Retirada confirmada!' });
            carregarDados();
        } catch (error) {
            setToast({ type: 'error', message: 'Erro ao confirmar retirada.' });
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="agendamentos-container">
            <h2>Logística e Agendamentos</h2>

            {/* Seção 1: Solicitações Aprovadas (Precisam de Agendamento) */}
            <section className="section-pendentes">
                <h3>📅 Pendente de Agendamento</h3>
                {solicitacoesAprovadas.length === 0 ? (
                    <p className="empty-text">Nenhuma solicitação aprovada aguardando agendamento.</p>
                ) : (
                    <div className="grid-pendentes">
                        {solicitacoesAprovadas.map(solicitacao => (
                            <Card key={solicitacao.id} className="card-pendente">
                                <h4>{solicitacao.anuncio.titulo}</h4>
                                <p><strong>Doador:</strong> {solicitacao.anuncio.usuario.name}</p>
                                <p><strong>Local:</strong> {solicitacao.anuncio.usuario.cidade} - {solicitacao.anuncio.usuario.estado}</p>
                                <Button onClick={() => setSelectedSolicitacao(solicitacao)}>
                                    Agendar Retirada
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Seção 2: Meus Agendamentos */}
            <section className="section-agendados">
                <h3>🚚 Agendamentos Confirmados</h3>
                {agendamentos.length === 0 ? (
                    <p className="empty-text">Nenhum agendamento encontrado.</p>
                ) : (
                    <div className="lista-agendamentos">
                        {agendamentos.map(agendamento => (
                            <Card key={agendamento.id} className="card-agendamento">
                                <div className="agendamento-info">
                                    <div className="agendamento-header">
                                        <span className={`status-badge ${agendamento.status_logistica.toLowerCase()}`}>
                                            {agendamento.status_logistica}
                                        </span>
                                        <span className="data-badge">
                                            {new Date(agendamento.data_agendada).toLocaleString()}
                                        </span>
                                    </div>
                                    <h4>{agendamento.solicitacao.anuncio.titulo}</h4>
                                    <p><strong>Endereço de Retirada:</strong> {agendamento.solicitacao.anuncio.endereco_retirada_customizado || agendamento.solicitacao.anuncio.usuario.endereco_completo || 'Endereço do Doador'}</p>
                                </div>

                                <div className="agendamento-actions">
                                    {agendamento.status_logistica === 'Agendada' && !agendamento.confirmacao_retirada && (
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => handleConfirmarRetirada(agendamento.id)}
                                        >
                                            Confirmar Coleta
                                        </Button>
                                    )}
                                    {agendamento.status_logistica === 'Coletada' && !agendamento.confirmacao_entrega && (
                                        <Button variant="secondary" size="small" disabled>
                                            Aguardando Entrega
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal de Agendamento (Simples) */}
            {selectedSolicitacao && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agendar Retirada: {selectedSolicitacao.anuncio.titulo}</h3>
                        <form onSubmit={handleAgendar}>
                            <Input
                                label="Data e Hora da Retirada"
                                type="datetime-local"
                                value={dataAgendamento}
                                onChange={(e) => setDataAgendamento(e.target.value)}
                                required
                            />
                            <div className="modal-actions">
                                <Button type="button" variant="secondary" onClick={() => setSelectedSolicitacao(null)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">Confirmar Agendamento</Button>
                            </div>
                        </form>
                    </div>
                </div>
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

export default Agendamentos;
