import React, { useState } from 'react';
import supabase from './supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BotaoLimparEExportar = ({ produtos, limparProdutos }) => {
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const gerarPDF = () => {
    const doc = new jsPDF();
    const dataHora = new Date().toLocaleString();
    const valorTotal = produtos.reduce((total, produto) => total + (parseFloat(produto.preco) * produto.quantidade), 0);

    // Configurações do documento
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("Lista de Produtos", 105, 20, null, null, "center");

    // Informações gerais
    doc.setFontSize(12);
    doc.text(`Data e Hora: ${dataHora}`, 20, 40);
    doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 20, 50);

    // Tabela de produtos
    const columns = ["Produto", "Quantidade", "Preço Unitário", "Valor Total"];
    const data = produtos.map(produto => [
      produto.nome,
      produto.quantidade.toString(),
      `R$ ${parseFloat(produto.preco).toFixed(2)}`,
      `R$ ${(parseFloat(produto.preco) * produto.quantidade).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [columns],
      body: data,
      startY: 60,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 152, 219] },
      alternateRowStyles: { fillColor: [242, 242, 242] }
    });

    return doc;
  };

  const limparEExportar = async () => {
    if (!nomeArquivo) {
      alert('Por favor, insira um nome para o arquivo.');
      return;
    }

    // Gerar e salvar o PDF
    const doc = gerarPDF();
    doc.save(`${nomeArquivo}.pdf`);

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
      setMostrarAlerta(true); // Mostrar o alerta customizado
      setTimeout(() => setMostrarAlerta(false), 5000); // Ocultar o alerta após 5 segundos
    } catch (error) {
      console.error('Erro ao limpar o banco de dados:', error.message);
      alert('Ocorreu um erro ao limpar o banco de dados.');
    }

    setMostrarModal(false);
    setNomeArquivo('');
  };

  return (
    <>
      <div className="w-full flex justify-center mb-4">
        <button 
          onClick={() => setMostrarModal(true)} 
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Limpar Lista e Exportar PDF
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Exportar e Limpar Lista</h2>
            <p className="mb-4">Esta ação irá exportar todos os produtos para um arquivo PDF e depois apagará o banco de dados. Esta ação não pode ser desfeita.</p>
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
                Exportar PDF e Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarAlerta && (
        <div role="alert" className="alert alert-success fixed bottom-4 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Todos os produtos foram exportados para PDF e removidos do banco de dados!</span>
        </div>
      )}
    </>
  );
};

export default BotaoLimparEExportar;