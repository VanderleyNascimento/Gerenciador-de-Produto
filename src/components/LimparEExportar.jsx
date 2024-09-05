import React, { useState } from 'react';
import { useProdutos } from './ProdutoContext';
import supabase from './supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function LimparEExportar() {
  const { produtos, setProdutos } = useProdutos();
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false); 

  const gerarPDF = () => {
    const doc = new jsPDF();
    const dataHora = new Date().toLocaleString();
    const valorTotal = produtos.reduce((total, produto) => total + (parseFloat(produto.preco) * produto.quantidade), 0);

    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("Lista de Compras", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Data e Hora: ${dataHora}`, 20, 40);
    doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 20, 50);

    const columns = ["Produto", "Quantidade", "Preço Unitário", "Valor Total", "Categoria", "Descrição"];
    const data = produtos.map(produto => [
      produto.nome,
      produto.quantidade.toString(),
      `R$ ${parseFloat(produto.preco).toFixed(2)}`,
      `R$ ${(parseFloat(produto.preco) * produto.quantidade).toFixed(2)}`,
      produto.categoria || "N/A",
      produto.descricao || "N/A"
    ]);

    doc.autoTable({
      head: [columns],
      body: data,
      startY: 70,
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

    const doc = gerarPDF();
    const pdfBlob = doc.output('blob');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const { data, error } = await supabase.storage
        .from('pdf-listas')
        .upload(`${user.id}/${nomeArquivo}.pdf`, pdfBlob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      await supabase
        .from('historico_listas')
        .insert([{ user_id: user.id, nome: nomeArquivo, pdf_path: data.path }]);

      await supabase
        .from('produtos')
        .delete()
        .in('id', produtos.map(produto => produto.id));

      setProdutos([]);
      setMostrarAlerta(true);
      setTimeout(() => setMostrarAlerta(false), 5000);
    } catch (error) {
      console.error('Erro ao limpar e exportar:', error.message);
      alert('Ocorreu um erro ao limpar e exportar a lista.');
    }

    setNomeArquivo('');
    setMostrarModal(false);
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Lista de Produtos</h1>
          <p className="py-6">Veja os produtos na lista e exporte-os para um PDF.</p>
          
          {produtos.length > 0 ? (
            <ul>
              {produtos.map((produto, index) => (
                <li key={index}>
                  <strong>Nome:</strong> {produto.nome} <br />
                  <strong>Quantidade:</strong> {produto.quantidade} <br />
                  <strong>Preço:</strong> R$ {produto.preco} <br />
                  <strong>Categoria:</strong> {produto.categoria || "N/A"} <br />
                  <strong>Descrição:</strong> {produto.descricao || "N/A"} <br />
                  <strong>Total:</strong> R$ {(produto.preco * produto.quantidade).toFixed(2)} <br /><br />
                </li>
              ))}
            </ul>
          ) : (
            <p>Não há produtos na lista.</p>
          )}

          <button 
            className="btn bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700" 
            onClick={() => setMostrarModal(true)}
          >
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





