# 🌐 R+Cidades Web - Frontend

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

Interface web da plataforma **R+Cidades**, uma solução de economia circular para doação de materiais de construção civil.

## 📸 Screenshots

> *Em breve: Adicione capturas de tela da aplicação*

---

## 🚀 Tecnologias

- **React 18.3** - Biblioteca JavaScript para interfaces
- **Vite 5.x** - Build tool moderna e rápida
- **React Router 6** - Roteamento SPA
- **Context API** - Gerenciamento de estado
- **CSS Modules** - Estilização com escopo local

---

## ✨ Funcionalidades

- 🔐 **Autenticação** - Login e registro de usuários
- 📢 **Catálogo de Materiais** - Navegação e busca de anúncios
- 🎨 **Interface Responsiva** - Design adaptável para mobile e desktop
- 📝 **Gestão de Anúncios** - Criar, editar e excluir anúncios
- 🤝 **Sistema de Solicitações** - Solicitar e gerenciar pedidos
- 📅 **Logística** - Agendar retiradas e confirmar entregas
- 📊 **Dashboard** - Visualizar impacto ambiental
- 🏢 **Bancos de Materiais** - Cadastro de pontos de coleta

---

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- Backend rodando (veja [r-cidades-api](https://github.com/SEU-USUARIO/r-cidades-api))

---

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/r-cidades-web.git
cd r-cidades-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8001/api
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build otimizado
npm run preview      # Preview do build de produção

# Qualidade
npm run lint         # Verifica erros de código
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Loading.jsx
│   ├── Modal.jsx
│   ├── Toast.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
│
├── pages/              # Páginas da aplicação
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Perfil.jsx
│   ├── CriarAnuncio.jsx
│   ├── MeusAnuncios.jsx
│   ├── DetalheAnuncio.jsx
│   ├── MinhasSolicitacoes.jsx
│   ├── Agendamentos.jsx
│   ├── BancosDeMateriais.jsx
│   └── CriarBancoDeMateriais.jsx
│
├── context/            # Context API
│   └── AuthContext.jsx
│
├── config/             # Configurações
│   └── api.js
│
├── index.css           # Estilos globais e design system
└── App.jsx             # Componente raiz e rotas
```

---

## 🎨 Design System

O projeto utiliza um design system baseado em variáveis CSS:

### Cores Principais
```css
--primary-color: #4f46e5;    /* Indigo */
--success-color: #10b981;    /* Verde */
--danger-color: #ef4444;     /* Vermelho */
--warning-color: #f59e0b;    /* Âmbar */
```

### Componentes Reutilizáveis
- **Button** - Botões com variantes (primary, secondary, danger)
- **Input** - Campos de formulário padronizados
- **Card** - Container para conteúdo
- **Loading** - Indicador de carregamento
- **Toast** - Notificações temporárias
- **Modal** - Diálogos modais

---

## 🔌 Integração com API

A comunicação com o backend é feita através do módulo `src/config/api.js`:

```javascript
import { api } from './config/api';

// GET
const anuncios = await api.get('/anuncios');

// POST
const novoAnuncio = await api.post('/anuncios', dados);

// PUT
await api.put(`/anuncios/${id}`, dadosAtualizados);

// DELETE
await api.delete(`/anuncios/${id}`);

// UPLOAD
await api.upload('/anuncios', formData);
```

---

## 🌐 Rotas da Aplicação

| Rota | Componente | Proteção | Descrição |
|------|-----------|----------|-----------|
| `/` | Home | Pública | Catálogo de materiais |
| `/login` | Login | Pública | Autenticação |
| `/register` | Register | Pública | Cadastro |
| `/dashboard` | Dashboard | Protegida | Métricas de impacto |
| `/perfil` | Perfil | Protegida | Dados do usuário |
| `/criar-anuncio` | CriarAnuncio | Protegida | Novo anúncio |
| `/meus-anuncios` | MeusAnuncios | Protegida | Gestão de anúncios |
| `/anuncio/:id` | DetalheAnuncio | Pública | Detalhes do anúncio |
| `/minhas-solicitacoes` | MinhasSolicitacoes | Protegida | Pedidos feitos |
| `/agendamentos` | Agendamentos | Protegida | Logística |
| `/bancos-materiais` | BancosDeMateriais | Pública | Pontos de coleta |

---

## 🔐 Autenticação

A autenticação é gerenciada pelo **AuthContext** usando tokens JWT:

```javascript
const { user, token, login, logout } = useAuth();

// Login
await login(email, password);

// Logout
logout();

// Verificar autenticação
if (token) {
  // Usuário autenticado
}
```

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente:
   - `VITE_API_URL` = URL da sua API em produção
3. Deploy automático a cada push!

### Build Manual

```bash
# Gerar build
npm run build

# A pasta 'dist' contém os arquivos estáticos
# Faça upload para seu servidor web
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 🔗 Links Relacionados

- **Backend**: [r-cidades-api](https://github.com/SEU-USUARIO/r-cidades-api)
- **Documentação da API**: Ver README do backend
- **Guia de Uso**: Consulte `GUIA_JORNADA_USUARIO.md` no repositório da API

---

## 👨‍💻 Autor

**Equipe R+Cidades**

---

## 🙏 Agradecimentos

- Comunidade React
- Vite Team
- Todos os contribuidores

---

**Feito com ❤️ para um futuro mais sustentável**
