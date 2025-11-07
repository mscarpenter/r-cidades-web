// Arquivo: src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Importe o Link

function Home() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8001/api/anuncios')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro de rede: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setAnuncios(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados da API:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Catálogo de Materiais</h2>
      
      {loading && <p>Carregando anúncios da API...</p>}
      {error && <p style={{ color: 'red' }}>Erro ao buscar dados: {error}</p>}

      {!loading && !error && (
        <div className="catalog-list">
          <h3>{anuncios.length} Anúncios Carregados!</h3>
          
          {/* 2. O .map() agora cria um <Link> para cada anúncio */}
          {anuncios.map(anuncio => (
            <Link to={`/anuncio/${anuncio.id}`} key={anuncio.id} className="anuncio-card-link">
              <div className="anuncio-card">
                <strong>{anuncio.titulo}</strong>
                <p>Condição: {anuncio.condicao}</p>
                <p>Quantidade: {anuncio.quantidade}</p>
                <p>Peso: {anuncio.peso_estimado_kg}kg</p>
                <p><em>{anuncio.descricao}</em></p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;