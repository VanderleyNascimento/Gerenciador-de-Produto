import React, { useState, useEffect, useRef } from 'react';
import { useProdutos } from './ProdutoContext.jsx';
import AdicionarProduto from './AdicionarProduto';

const GerenciadorProdutos = () => {
  const { produtos } = useProdutos();
  const listaProdutosRef = useRef(null);
  const [valorTotal, setValorTotal] = useState(0);
  const [itemAdicionadoRecentemente, setItemAdicionadoRecentemente] = useState(null);

  const calcularValorTotal = () => {
    const total = produtos.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    setValorTotal(total);
  };

  useEffect(() => {
    calcularValorTotal();
  }, [produtos]);

  return (
    <div className="w-full p-4">
      {/* <AdicionarProduto setItemAdicionadoRecentemente={setItemAdicionadoRecentemente} />*/}
      <div className="bg-white shadow-md rounded-lg p-6 overflow-y-auto max-h-[500px]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Produtos</h2>
        <ul ref={listaProdutosRef} className="divide-y divide-gray-200">
          {produtos.map((produto) => (
            <li key={produto.id} className={`flex items-center justify-between py-3 px-4`}>
              <div className="flex-grow">
                <span className="text-gray-900 font-medium">{produto.nome}</span>
                <span className="text-gray-600 ml-2"> - R$ {produto.preco.toFixed(2)}</span>
                <span className="text-gray-500 ml-2">(Quantidade: {produto.quantidade})</span>
                <span className="text-gray-500 ml-2">Total: R$ {(produto.preco * produto.quantidade).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 bg-red-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Valor Total dos Itens</h3>
          <p className="text-2xl font-bold text-red-700">R$ {valorTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default GerenciadorProdutos;