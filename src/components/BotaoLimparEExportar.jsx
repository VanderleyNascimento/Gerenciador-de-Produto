import React, { useState } from 'react';
import supabase from './supabaseClient';

const BotaoLimparEExportar = ({ produtos, limparProdutos }) => {
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const gerarConteudoArquivo = () => {
    const dataHora = new Date().toLocaleString();
    const valorTotal = produtos.reduce((total, produto) => total + parseFloat(produto.preco), 0);
    
    let conteudo = `Exportação de Produtos - ${dataHora}\n\n`;
    conteudo += `Valor Total: R$ ${valorTotal.toFixed(2)}\n\n`;
    conteudo += 'Lista de Produtos:\n';
    produtos.forEach(produto => {
      conteudo += `${produto.nome} - R$ ${parseFloat(produto.preco).toFixed(2)}\n`;
    });

    return conteudo;
  };

  const limparEExportar = async () => {
    if (!nomeArquivo) {
      alert('Por favor, insira um nome para o arquivo.');
      return;
    }

    const conteudo = gerarConteudoArquivo();

    // Criar e baixar o arquivo
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nomeArquivo}.txt`;
    link.click();

    // Limpar o banco de dados usando Supabase
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .in('id', produtos.map(produto => produto.id));

      if (error) {
        throw error;
      }

      limparProdutos(); // Chamar a função passada por props para limpar os produtos
      alert('Todos os produtos foram exportados e removidos do banco de dados.');
    } catch (error) {
      console.error('Erro ao limpar o banco de dados:', error.message);
      alert('Ocorreu um erro ao limpar o banco de dados.');
    }

    setMostrarModal(false);
    setNomeArquivo('');
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <button 
          onClick={() => setMostrarModal(true)} 
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Limpar Lista e Exportar
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Exportar e Limpar Lista</h2>
            <p className="mb-4">Esta ação irá exportar todos os produtos para um arquivo de texto e depois apagará o banco de dados. Esta ação não pode ser desfeita.</p>
            <input
              type="text"
              value={nomeArquivo}
              onChange={(e) => setNomeArquivo(e.target.value)}
              placeholder="Nome do arquivo"
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setMostrarModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={limparEExportar}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Exportar e Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BotaoLimparEExportar;