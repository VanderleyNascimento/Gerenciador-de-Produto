import React from 'react';
import ProdutoContainer from './components/ProdutoContainer';
import NavBar from './components/NavBar';
import { ProdutoProvider } from './components/ProdutoContext.jsx'; // Importe o Provider

function App() {
  return (
    <ProdutoProvider> 
      <div className="App">
        <NavBar />
        <ProdutoContainer />
      </div>
    </ProdutoProvider>
  );
}

export default App;