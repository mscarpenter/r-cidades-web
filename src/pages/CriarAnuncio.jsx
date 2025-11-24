// Arquivo: src/pages/CriarAnuncio.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { Input, Button, Card, Toast } from '../components';
import './CriarAnuncio.css';

function CriarAnuncio() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    quantidade: '',
    condicao: 'novo',
    peso_estimado_kg: '',
    categoria_material_id: '',
    banco_de_materiais_id: '', // Novo campo
  });

  const [categorias, setCategorias] = useState([]);
  const [bancos, setBancos] = useState([]); // Novo estado
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [cats, banks] = await Promise.all([
        api.get('/categorias'),
        api.get('/bancos-materiais')
      ]);
      setCategorias(cats);
      setBancos(banks);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setToast({ type: 'error', message: 'Máximo de 5 imagens permitidas.' });
      return;
    }

    setImagens(files);

    // Gerar previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar o anúncio
      const anuncio = await api.post('/anuncios', formData, token);

      // 2. Upload de imagens (se houver)
      if (imagens.length > 0) {
        const formDataImagens = new FormData();
        imagens.forEach(file => {
          formDataImagens.append('imagens[]', file);
        });

        await api.upload(`/anuncios/${anuncio.id}/imagens`, formDataImagens, token);
      }

      setToast({ type: 'success', message: 'Anúncio criado com sucesso!' });

      setTimeout(() => {
        navigate('/meus-anuncios');
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      setToast({
        type: 'error',
        message: error.message || 'Erro ao criar anúncio.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="criar-anuncio-container">
      <h2>Publicar Novo Anúncio</h2>

      <Card>
        <form onSubmit={handleSubmit} className="criar-anuncio-form">
          <Input
            label="Título do Anúncio"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ex: Sobras de Tijolos 8 furos"
          />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                name="categoria_material_id"
                value={formData.categoria_material_id}
                onChange={handleChange}
                className="select-input"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="condicao">Condição</label>
              <select
                id="condicao"
                name="condicao"
                value={formData.condicao}
                onChange={handleChange}
                className="select-input"
                required
              >
                <option value="novo">Novo</option>
                <option value="usado">Usado</option>
                <option value="danificado">Danificado</option>
              </select>
            </div>
          </div>

          {/* Seleção de Banco de Materiais (Opcional) */}
          <div className="form-group">
            <label htmlFor="banco">Vincular a um Banco de Materiais (Opcional)</label>
            <select
              id="banco"
              name="banco_de_materiais_id"
              value={formData.banco_de_materiais_id || ''}
              onChange={handleChange}
              className="select-input"
            >
              <option value="">Nenhum (Anúncio Individual)</option>
              {bancos.map(banco => (
                <option key={banco.id} value={banco.id}>{banco.nome}</option>
              ))}
            </select>
            <small style={{ color: '#666', marginTop: '0.25rem' }}>
              Selecione se este material está armazenado em um ponto de coleta oficial.
            </small>
          </div>

          <div className="form-row">
            <Input
              label="Quantidade"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange}
              required
              placeholder="Ex: 100"
            />

            <Input
              label="Peso Estimado (kg)"
              name="peso_estimado_kg"
              type="number"
              value={formData.peso_estimado_kg}
              onChange={handleChange}
              placeholder="Opcional"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição Detalhada</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="textarea-input"
              rows="5"
              required
              placeholder="Descreva o material, estado de conservação, motivo da doação, etc."
            />
          </div>

          <div className="form-group">
            <label>Fotos do Material (Máx. 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />

            {previews.length > 0 && (
              <div className="image-previews">
                {previews.map((src, index) => (
                  <div key={index} className="preview-item">
                    <img src={src} alt={`Preview ${index}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Anúncio'}
            </Button>
          </div>
        </form>
      </Card>

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

export default CriarAnuncio;