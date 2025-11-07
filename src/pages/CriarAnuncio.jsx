// Arquivo: src/pages/CriarAnuncio.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Importe o AuthContext
import { useNavigate } from 'react-router-dom';

function CriarAnuncio() {
  // 2. Pegue o 'token' do contexto. Isso é o "crachá"
  const { token } = useAuth();
  const navigate = useNavigate();

  // 3. Estados para controlar o formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [condicao, setCondicao] = useState('Novo (Sobras)'); // Valor padrão
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Criando anúncio...');

    fetch('http://localhost:8001/api/anuncios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 4. Envie o "crachá" de autorização
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        titulo: titulo,
        descricao: descricao,
        quantidade: quantidade,
        condicao: condicao,
      }),
    })
    .then(response => {
      if (!response.ok) {
        // Se a API retornar 401 (Não autorizado) ou 422 (Validação)
        throw new Error(`Erro: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setMessage('Anúncio criado com sucesso! Redirecionando...');
      // 5. Redireciona para a Home após criar
      setTimeout(() => {
        navigate('/');
      }, 2000);
    })
    .catch(error => {
      console.error('Erro ao criar anúncio:', error);
      setMessage(`Erro ao criar anúncio: ${error.message}. Você está logado?`);
    });
  };

  return (
    <div>
      <h2>Criar Novo Anúncio de Doação</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="text"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
            placeholder="Ex: 100 unidades, 10m², Lote"
          />
        </div>
        <div>
          <label>Condição:</label>
          <select value={condicao} onChange={(e) => setCondicao(e.target.value)}>
            <option value="Novo (Sobras)">Novo (Sobras)</option>
            <option value="Usado (Bom estado)">Usado (Bom estado)</option>
            <option value="Usado (Requer reparo)">Usado (Requer reparo)</option>
          </select>
        </div>
        <button type="submit">Publicar Anúncio</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CriarAnuncio;