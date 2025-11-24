// Arquivo: src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { api } from '../config/api';
import { Card, Loading } from '../components';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.get('/dashboard');
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
        setError("Não foi possível carregar os dados do dashboard.");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!stats) return <p>Nenhuma métrica encontrada.</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard de Impacto</h2>
        <p>Veja como estamos transformando resíduos em recursos.</p>
      </div>

      <div className="kpi-grid">
        <Card className="kpi-card highlight">
          <div className="kpi-icon">♻️</div>
          <h3>{stats.total_peso_doado_kg} kg</h3>
          <p>Resíduos Desviados de Aterros</p>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon">📢</div>
          <h3>{stats.total_anuncios_publicados}</h3>
          <p>Anúncios Publicados</p>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon">🤝</div>
          <h3>{stats.total_solicitacoes_feitas}</h3>
          <p>Conexões Realizadas</p>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon">👥</div>
          <h3>{stats.total_usuarios_registrados}</h3>
          <p>Membros na Comunidade</p>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;