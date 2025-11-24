// Arquivo: src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, Footer } from './components'; // Importa Navbar e Footer

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CriarAnuncio from './pages/CriarAnuncio';
import DetalheAnuncio from './pages/DetalheAnuncio';
import Perfil from './pages/Perfil';
import MeusAnuncios from './pages/MeusAnuncios';
import MinhasSolicitacoes from './pages/MinhasSolicitacoes';
import BancosDeMateriais from './pages/BancosDeMateriais';
import CriarBancoDeMateriais from './pages/CriarBancoDeMateriais';
import Agendamentos from './pages/Agendamentos';

import './App.css';

// Componente de "Rota Protegida"
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      {/* Nova Navbar Responsiva */}
      <Navbar />

      {/* Onde as páginas serão renderizadas */}
      <div className="container">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/bancos-materiais" element={<BancosDeMateriais />} />
          <Route path="/anuncio/:id" element={<DetalheAnuncio />} />

          {/* Rotas de Autenticação (Redirecionam se já logado) */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* Rotas Protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/criar-anuncio" element={<ProtectedRoute><CriarAnuncio /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/meus-anuncios" element={<ProtectedRoute><MeusAnuncios /></ProtectedRoute>} />
          <Route path="/minhas-solicitacoes" element={<ProtectedRoute><MinhasSolicitacoes /></ProtectedRoute>} />
          <Route path="/criar-banco" element={<ProtectedRoute><CriarBancoDeMateriais /></ProtectedRoute>} />
          <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

// Componente auxiliar para impedir acesso a login/register se já logado
function PublicOnlyRoute({ children }) {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default App;