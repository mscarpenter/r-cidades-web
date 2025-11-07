// Arquivo: src/App.jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './context/AuthContext'

// Importe as páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CriarAnuncio from './pages/CriarAnuncio'
import DetalheAnuncio from './pages/DetalheAnuncio'; // 1. Importe a nova página

// Componente de "Rota Protegida"
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { token, user, logout } = useAuth();

  return (
    <BrowserRouter>
      {/* Menu de Navegação */}
      <nav className="navbar">
        <Link to="/" className="brand">R+Cidades</Link>
        <div className="nav-links">
          <Link to="/">Catálogo</Link>
          
          {token ? (
            // Se o usuário ESTIVER logado
            <>
              <Link to="/criar-anuncio">Criar Anúncio</Link>
              <span className="welcome-user">Olá, {user.name}!</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </>
          ) : (
            // Se o usuário NÃO estiver logado
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registrar</Link>
            </>
          )}
        </div>
      </nav>

      {/* Onde as páginas serão renderizadas */}
      <div className="container">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
          
          {/* 2. Rota de Detalhe (Pública) */}
          <Route path="/anuncio/:id" element={<DetalheAnuncio />} />

          {/* Rotas Protegidas */}
          <Route 
            path="/criar-anuncio" 
            element={
              <ProtectedRoute>
                <CriarAnuncio />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App