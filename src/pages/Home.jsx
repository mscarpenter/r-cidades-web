// Arquivo: src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../config/api';
import { Input, Button, Card, Loading } from '../components';
import './Home.css';

function Home() {
  const [anuncios, setAnuncios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    condicao: '',
    cidade: '',
    categoria_id: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [anunciosData, categoriasData] = await Promise.all([
        api.get('/anuncios'),
        api.get('/categorias')
      ]);

      setAnuncios(anunciosData);
      setCategorias(categoriasData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const carregarAnuncios = async (filtrosAtuais = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtrosAtuais.search) params.append('search', filtrosAtuais.search);
      if (filtrosAtuais.condicao) params.append('condicao', filtrosAtuais.condicao);
      if (filtrosAtuais.cidade) params.append('cidade', filtrosAtuais.cidade);
      if (filtrosAtuais.categoria_id) params.append('categoria_id', filtrosAtuais.categoria_id);

      const data = await api.get(`/anuncios?${params.toString()}`);
      setAnuncios(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    carregarAnuncios(filters);
  };

  const handleLimparFiltros = () => {
    setFilters({ search: '', condicao: '', cidade: '', categoria_id: '' });
    carregarAnuncios({});
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Encontre materiais de construção para doação</h1>
        <p>Conectando quem tem sobras com quem precisa construir.</p>

        {/* Barra de Busca e Filtros */}
        <Card className="search-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <Input
                name="search"
                placeholder="O que você procura? (Ex: Tijolos, Cimento)"
                value={filters.search}
                onChange={handleFilterChange}
              />

              <div className="filter-group">
                <select
                  name="categoria_id"
                  value={filters.categoria_id}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Todas as Categorias</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>

                <select
                  name="condicao"
                  value={filters.condicao}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Todas as Condições</option>
                  <option value="novo">Novo</option>
                  <option value="usado">Usado</option>
                  <option value="danificado">Danificado</option>
                </select>

                <Input
                  name="cidade"
                  placeholder="Cidade"
                  value={filters.cidade}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="search-actions">
              <Button type="submit">Buscar</Button>
              <Button type="button" variant="secondary" onClick={handleLimparFiltros}>
                Limpar
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="error-message">Erro ao buscar dados: {error}</p>
      ) : (
        <div className="catalog-section">
          <div className="catalog-header">
            <h2>Catálogo de Materiais</h2>
            <span>{anuncios.length} anúncios encontrados</span>
          </div>

          {anuncios.length === 0 ? (
            <div className="empty-results">
              <p>Nenhum anúncio encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="anuncios-grid">
              {anuncios.map(anuncio => (
                <Link to={`/anuncio/${anuncio.id}`} key={anuncio.id} className="anuncio-card-link">
                  <Card className="anuncio-card-home">
                    {anuncio.imagens && anuncio.imagens.length > 0 ? (
                      <div
                        className="anuncio-image"
                        style={{ backgroundImage: `url(${anuncio.imagens[0]})` }}
                      />
                    ) : (
                      <div className="anuncio-image-placeholder">
                        📷 Sem imagem
                      </div>
                    )}

                    <div className="anuncio-content">
                      <h3>{anuncio.titulo}</h3>
                      <div className="anuncio-tags">
                        {anuncio.categoria_material && (
                          <span className="tag tag-categoria">{anuncio.categoria_material.nome}</span>
                        )}
                        <span className={`tag tag-${anuncio.condicao}`}>{anuncio.condicao}</span>
                        {anuncio.usuario?.cidade && (
                          <span className="tag tag-location">📍 {anuncio.usuario.cidade}</span>
                        )}
                      </div>
                      <p className="anuncio-desc">{anuncio.descricao}</p>
                      <div className="anuncio-footer">
                        <span>📦 {anuncio.quantidade} un.</span>
                        {anuncio.peso_estimado_kg && <span>⚖️ {anuncio.peso_estimado_kg}kg</span>}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;