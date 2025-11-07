// Arquivo: src/pages/DetalheAnuncio.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Para checar se está logado

function DetalheAnuncio() {
  const { id } = useParams(); // Pega o ID (ex: "1") da URL
  const { token } = useAuth(); // Pega o token para saber se está logado
  const navigate = useNavigate();

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o formulário de solicitação
  const [justificativa, setJustificativa] = useState('');
  const [message, setMessage] = useState('');

  // 1. Efeito para buscar os dados do anúncio na API
  useEffect(() => {
    fetch(`http://localhost:8001/api/anuncios/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Anúncio não encontrado');
        return response.json();
      })
      .then(data => {
        setAnuncio(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar anúncio:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // 2. Função para enviar a solicitação (AGORA MAIS INTELIGENTE)
  const handleSolicitar = async (event) => {
    event.preventDefault();
    setMessage('Enviando solicitação...');

    try {
      const response = await fetch('http://localhost:8001/api/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          anuncio_id: id,
          justificativa_beneficiario: justificativa,
        }),
      });

      // Se a resposta NÃO for OK
      if (!response.ok) {
        // Se for um erro de validação (422), a API envia um JSON
        if (response.status === 422) {
          const errorData = await response.json();
          // Pega a *primeira* mensagem de erro (ex: "O campo justificativa...")
          const firstError = Object.values(errorData.errors)[0][0];
          throw new Error(firstError);
        }
        // Outros erros (500, 401, etc)
        throw new Error(`Erro ${response.status}: A API não respondeu bem.`);
      }

      // Se a resposta FOR OK (201)
      const data = await response.json();
      setMessage('Solicitação enviada com sucesso! Você será redirecionado.');
      setTimeout(() => navigate('/'), 2000); // Volta para a Home

    } catch (error) {
      // Pega qualquer erro (da rede ou o que jogamos acima)
      console.error('Erro ao solicitar:', error);
      setMessage(error.message); // Exibe o erro específico!
    }
  };

  // --- Renderização ---
  if (loading) return <p>Carregando detalhes do anúncio...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!anuncio) return <p>Anúncio não encontrado.</p>;

  return (
    <div>
      {/* 1. Seção de Detalhes */}
      <div className="anuncio-card">
        <h2>{anuncio.titulo}</h2>
        <p><strong>Condição:</strong> {anuncio.condicao}</p>
        <p><strong>Quantidade:</strong> {anuncio.quantidade}</p>
        <p><strong>Peso Estimado:</strong> {anuncio.peso_estimado_kg}kg</p>
        <p><strong>Descrição:</strong> {anuncio.descricao}</p>
      </div>

      {/* 2. Seção de Solicitação (Condicional) */}
      <div className="solicitacao-section">
        <h3>Solicitar este Material</h3>
        {token ? (
          // Se ESTIVER logado, mostra o formulário
          <form onSubmit={handleSolicitar} className="form-card">
            <div>
              <label>Justificativa (Por que você precisa deste material?)</label>
              <textarea
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                required
                minLength="10"
                placeholder="Ex: Preciso para reformar o muro da minha casa..."
              />
            </div>
            <button type="submit">Enviar Solicitação</button>
            {/* Agora a mensagem de erro será específica */}
            {message && <p>{message}</p>}
          </form>
        ) : (
          // Se NÃO estiver logado, mostra o link de Login
          <p className="login-prompt">
            Você precisa estar logado para solicitar materiais.
            <Link to={`/login?redirect=/anuncio/${id}`}> Fazer Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default DetalheAnuncio;