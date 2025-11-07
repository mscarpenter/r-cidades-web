// Arquivo: src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importe o 'useNavigate'

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 2. Inicialize o hook de navegação

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Registrando...');

    fetch('http://localhost:8001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message.includes('sucesso')) {
        setMessage(data.message + " Você será redirecionado para o Login...");
        // 3. SUCESSO: Redireciona para o Login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`Erro: ${JSON.stringify(data)}`);
      }
    })
    .catch(error => {
      console.error('Erro no registro:', error);
      setMessage('Erro ao registrar. Tente novamente.');
    });
  };

  // (O JSX do return continua o mesmo)
  return (
    <div>
      <h2>Registrar Novo Usuário</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <div>
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Senha (mínimo 8 caracteres):</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="8" />
        </div>
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;