// ProdutoContainer.jsx
import React, { useState } from 'react';
import AdicionarProduto from './AdicionarProduto';
import GerenciadorProdutos from './GerenciadorProdutos';
import DeletarProduto from './DeletarProduto';
import { useProdutos } from './ProdutoContext.jsx';

const ProdutoContainer = () => {
  const { produtos, setProdutos, globalError, setGlobalError } = useProdutos();
  const [itemAdicionado, setItemAdicionado] = useState('');

  const handleProdutoAdicionado = (novoProduto) => {
    setProdutos((prevProdutos) => [...prevProdutos, novoProduto]);
    setItemAdicionado(novoProduto.nome);
  };

  const handleProdutoRemovido = (idProduto) => {
    setProdutos((prevProdutos) => prevProdutos.filter(produto => produto.id !== idProduto));
  };

  const limparProdutos = () => {
    setProdutos([]);
  };

  return (
    <div>
      <AdicionarProduto onProdutoAdicionado={handleProdutoAdicionado} setGlobalError={setGlobalError} />
      <GerenciadorProdutos onProdutoRemovido={handleProdutoRemovido} />
      <DeletarProduto onProdutoRemovido={handleProdutoRemovido} />

      {globalError && <div className="text-red-500 mt-4">{globalError}</div>}
      {itemAdicionado && <div className="text-green-500 mt-4">Último produto adicionado: {itemAdicionado}</div>}
    </div>
  );
};

export default ProdutoContainer;
