import React, { useState } from 'react';
import { useProdutos } from './ProdutoContext';
import supabase from './supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function LimparEExportar() {
  const { produtos, setProdutos } = useProdutos();
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
    doc.text("Lista de Compras", 105, 20, null, null, "center");

    // Informações gerais
    doc.setFontSize(12);
    doc.text(`Data e Hora: ${dataHora}`, 20, 40);
    doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 20, 50);

    // Tabela de produtos
    let yPos = 70;
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
      startY: yPos,
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

    if (!produtos || produtos.length === 0) {
      alert('Não há produtos para exportar ou limpar.');
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

      setProdutos([]); // Limpar os produtos no contexto
      setMostrarAlerta(true); // Mostrar o alerta customizado
      setTimeout(() => setMostrarAlerta(false), 5000); // Ocultar o alerta após 5 segundos
    } catch (error) {
      console.error('Erro ao limpar o banco de dados:', error.message);
      alert('Ocorreu um erro ao limpar o banco de dados.');
    }

    setNomeArquivo('');
    setMostrarModal(false);
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Salve esta lista de produtos</h1>
          <p className="py-6">
            Esta ação irá exportar todos os produtos para um arquivo PDF e depois apagará o banco de dados. Esta ação não pode ser desfeita.
          </p>
          <button className="btn bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700" onClick={() => setMostrarModal(true)}>
          Exportar e Limpar
          </button>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Exportar e Limpar Lista</h3>
            <p className="py-4">Digite um nome para o arquivo PDF de exportação:</p>
            <input
              type="text"
              value={nomeArquivo}
              onChange={(e) => setNomeArquivo(e.target.value)}
              placeholder="Nome do arquivo"
              className="input input-bordered w-full max-w-xs"
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={limparEExportar}>Exportar e Limpar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarAlerta && (
        <div className="alert alert-success shadow-lg fixed bottom-4 right-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Todos os produtos foram exportados para PDF e removidos do banco de dados!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LimparEExportar;