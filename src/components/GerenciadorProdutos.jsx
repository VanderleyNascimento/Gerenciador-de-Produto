import React, { useState, useEffect, useRef } from 'react';
import { useProdutos } from './ProdutoContext.jsx';
import supabase from './supabaseClient';

const GerenciadorProdutos = () => {
  const { produtos, setProdutos, loading } = useProdutos();
  const listaProdutosRef = useRef(null);
  const [valorTotal, setValorTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Função para calcular o valor total dos produtos
  const calcularValorTotal = () => {
    const total = produtos.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    setValorTotal(total);
  };

  // Efeito para recalcular o valor total quando a lista de produtos mudar
  useEffect(() => {
    calcularValorTotal();
  }, [produtos]);

  // Função para mostrar o alerta
  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Esconde o alerta após 3 segundos
  };

  // Função para deletar um produto
  const deletarProduto = async (id) => {
    try {
      // Deletar o produto do banco de dados
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        showAlertMessage('Ocorreu um erro ao deletar o produto. Por favor, tente novamente.');
        return;
      }

      // Atualizar o estado local removendo o produto
      setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
      showAlertMessage('Produto deletado com sucesso.');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      showAlertMessage('Ocorreu um erro inesperado ao deletar o produto. Por favor, tente novamente mais tarde.');
    }
  };

  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div className="w-full bg-white shadow-md artboard artboard-horizontal">
      <div className="bg-white shadow-md rounded-lg p-6 overflow-y-auto max-h-[500px]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Produtos</h2>
        
        {/* Alerta personalizado */}
        {showAlert && (
          <div role="alert" className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{alertMessage}</span>
          </div>
        )}

        <ul ref={listaProdutosRef} className="divide-y divide-gray-200">
          {produtos.map((produto) => (
            <li key={produto.id} className="flex items-center justify-between py-3 px-4">
              <div className="flex-grow">
                <span className="text-gray-900 font-medium">{produto.nome}</span>
                <span className="text-gray-600 ml-2"> - R$ {produto.preco.toFixed(2)}</span>
                <span className="text-gray-500 ml-2">(Quantidade: {produto.quantidade})</span>
                <span className="text-gray-500 ml-2">Total: R$ {(produto.preco * produto.quantidade).toFixed(2)}</span>
              </div>
              <button
                onClick={() => deletarProduto(produto.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remover
              </button>
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
