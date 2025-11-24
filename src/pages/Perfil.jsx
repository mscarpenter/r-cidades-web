// Arquivo: src/pages/Perfil.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../config/api';
import { Button, Input, Card, Loading, Toast } from '../components';
import './Perfil.css';

function Perfil() {
  const { token, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tipo: 'doador',
    telefone: '',
    endereco_completo: '',
    cidade: '',
    estado: '',
    cep: '',
    cpf_cnpj: '',
  });

  const [stats, setStats] = useState({
    total_anuncios: 0,
    anuncios_ativos: 0,
    total_solicitacoes: 0,
    solicitacoes_aprovadas: 0,
  });

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const data = await api.get('/profile', token);
      
      setFormData({
        name: data.name || '',
        email: data.email || '',
        tipo: data.tipo || 'doador',
        telefone: data.telefone || '',
        endereco_completo: data.endereco_completo || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        cep: data.cep || '',
        cpf_cnpj: data.cpf_cnpj || '',
      });

      if (data.stats) {
        setStats(data.stats);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setToast({ type: 'error', message: 'Erro ao carregar perfil.' });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put('/profile', formData, token);
      
      // Atualiza o contexto do usuário
      setUser(response.user);
      
      setToast({ type: 'success', message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setToast({ 
        type: 'error', 
        message: error.message || 'Erro ao atualizar perfil.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>

      {/* Estatísticas */}
      <div className="stats-grid">
        <Card className="stat-card">
          <h3>{stats.total_anuncios}</h3>
          <p>Total de Anúncios</p>
        </Card>
        <Card className="stat-card">
          <h3>{stats.anuncios_ativos}</h3>
          <p>Anúncios Ativos</p>
        </Card>
        <Card className="stat-card">
          <h3>{stats.total_solicitacoes}</h3>
          <p>Solicitações Feitas</p>
        </Card>
        <Card className="stat-card">
          <h3>{stats.solicitacoes_aprovadas}</h3>
          <p>Solicitações Aprovadas</p>
        </Card>
      </div>

      {/* Formulário de Perfil */}
      <Card>
        <form onSubmit={handleSubmit} className="perfil-form">
          <h3>Informações Pessoais</h3>
          
          <div className="form-row">
            <Input
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Usuário</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="select-input"
              >
                <option value="doador">Doador</option>
                <option value="beneficiario">Beneficiário</option>
              </select>
            </div>

            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="form-row">
            <Input
              label="CPF/CNPJ"
              name="cpf_cnpj"
              value={formData.cpf_cnpj}
              onChange={handleChange}
              placeholder="000.000.000-00"
            />
          </div>

          <h3>Endereço</h3>

          <Input
            label="Endereço Completo"
            name="endereco_completo"
            value={formData.endereco_completo}
            onChange={handleChange}
            placeholder="Rua, número, complemento"
          />

          <div className="form-row">
            <Input
              label="Cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />

            <Input
              label="Estado (UF)"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              maxLength="2"
              placeholder="SP"
            />

            <Input
              label="CEP"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="00000-000"
            />
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Card>

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

export default Perfil;
