// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProdutoContainer from './components/ProdutoContainer';
import NavBar from './components/NavBar';
import { ProdutoProvider } from './components/ProdutoContext.jsx';
import Footer from './components/Footer.jsx';
import LimparEExportar from './components/LimparEExportar';
import Login from './components/Login.jsx';
import Register from './components/Registration.jsx';
import PasswordReset from './components/PasswordReset';
import ChangePassword from './components/ChangePassword'; // Novo componente
import EditarNomeUsuario from './components/EditarNomeUsuario';
import HistoricoListas from './components/HistoricoListas';
import ProtectedRoute from './ProtectedRoute.jsx';

function App() {
  return (
    <ProdutoProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/change-password" element={<ChangePassword />} /> {/* Rota protegida */}

            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <ProdutoContainer />
              </ProtectedRoute>
            } />
            <Route path="/limpar-e-exportar" element={
              <ProtectedRoute>
                <LimparEExportar />
              </ProtectedRoute>
            } />
            <Route path="/editar-nome" element={
              <ProtectedRoute>
                <EditarNomeUsuario />
              </ProtectedRoute>
            } />
            <Route path="/historico-listas" element={
              <ProtectedRoute>
                <HistoricoListas />
              </ProtectedRoute>
            } />

            {/* Rota para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ProdutoProvider>
  );
}

// Componente simples para página não encontrada
const NotFound = () => (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="py-6">Oops! Página não encontrada.</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>Voltar</button>
      </div>
    </div>
  </div>
);

export default App;

