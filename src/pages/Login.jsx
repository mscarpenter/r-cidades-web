// Arquivo: src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importe o nosso hook 'useAuth'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Pegue a função 'login' do Contexto

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Fazendo login...');

    fetch('http://localhost:8001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        // 3. SUCESSO!
        setMessage(`Login bem-sucedido! Redirecionando...`);
        // 4. Salva o token e o usuário no Contexto (e localStorage)
        login(data.access_token, data.user); 
        // 5. Redireciona para a Home (/)
        navigate('/');
      } else {
        setMessage(data.message || 'Erro no login.');
      }
    })
    .catch(error => {
      console.error('Erro no login:', error);
      setMessage('Erro ao fazer login. Tente novamente.');
    });
  };

  // (O JSX do return continua o mesmo)
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;