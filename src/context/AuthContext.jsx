// Arquivo: src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// 1. Cria o Contexto (o "cérebro" vazio)
const AuthContext = createContext(null);

// 2. Cria o "Provedor" (o componente que vai guardar o estado)
export function AuthProvider({ children }) {
  // 3. O estado começa lendo o localStorage (para "lembrar" do usuário)
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')) || null);

  // 4. Função de Login: Salva no estado E no localStorage
  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // 5. Função de Logout: Limpa o estado E o localStorage
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    // (No futuro, também chamaremos a API /api/logout aqui)
  };

  // 6. Disponibiliza o estado e as funções para o resto do app
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Cria um "Hook" (atalho) para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};