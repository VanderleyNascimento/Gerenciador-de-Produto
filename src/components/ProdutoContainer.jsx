import React, { useContext, useState } from 'react';
import AdicionarProduto from './AdicionarProduto';
import GerenciadorProdutos from './GerenciadorProdutos';
import BotaoLimparEExportar from './BotaoLimparEExportar';
import DeletarProduto from './DeletarProduto';
import { useProdutos } from './ProdutoContext.jsx';

const ProdutoContainer = () => {
  const { produtos, setProdutos, globalError, setGlobalError } = useProdutos();
  const [itemAdicionado, setItemAdicionado] = useState('');

  const handleProdutoAdicionado = (novosProdutos) => {
    setProdutos((prevProdutos) => [...prevProdutos, ...novosProdutos]);
    setItemAdicionado(novosProdutos[0]?.nome || ''); // Assumindo que novosProdutos é um array
  };

  const handleProdutoRemovido = (idProduto) => {
    setProdutos(produtos.filter(produto => produto.id !== idProduto));
  };

  const limparProdutos = () => {
    setProdutos([]);
  };

  return (
    <div>
      <AdicionarProduto 
        onProdutoAdicionado={handleProdutoAdicionado} 
        setItemAdicionadoRecentemente={setItemAdicionado} 
        setGlobalError={setGlobalError} 
      />
      <GerenciadorProdutos produtos={produtos} onProdutoRemovido={handleProdutoRemovido} />
      <DeletarProduto produtos={produtos} setProdutos={setProdutos} />
      <BotaoLimparEExportar produtos={produtos} limparProdutos={limparProdutos} />

     
      {globalError && <div className="text-red-500 mt-4">{globalError}</div>}
      {itemAdicionado && <div className="text-green-500 mt-4">Último produto adicionado: {itemAdicionado}</div>}
    </div>
  );
};

export default ProdutoContainer;