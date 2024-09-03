import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProdutoContainer from './components/ProdutoContainer';
import NavBar from './components/NavBar';
import { ProdutoProvider } from './components/ProdutoContext.jsx'; // Importe o Provider
import Footer from './components/Footer.jsx';
import LimparEExportar from './components/LimparEExportar'; // Importe o novo componente

function App() {
  return (
    <ProdutoProvider> 
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<ProdutoContainer />} />
            <Route path="/limpar-e-exportar" element={<LimparEExportar />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ProdutoProvider>
  );
}

export default App;
