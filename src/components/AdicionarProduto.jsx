import React, { useState } from 'react';
import { useProdutos } from './ProdutoContext';
import supabase from './supabaseClient';

function AdicionarProduto() {
  const { produtos, setProdutos } = useProdutos();
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleAdicionarProduto = async () => {
    if (!nome || !quantidade || !preco) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
  
    const novoProduto = {
      nome,
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco),
      descricao,
      categoria,
    };
  
    try {
      // Obtém o usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error('Erro ao obter o usuário: ' + userError.message);
      if (!user) throw new Error('Usuário não autenticado.');
  
      // Inserir o produto e retornar os dados inseridos
      const { data, error } = await supabase
        .from('produtos')
        .insert([{ ...novoProduto, user_id: user.id }])
        .select();  // Adiciona o .select() para retornar os dados inseridos
  
      if (error) throw new Error('Erro ao adicionar produto: ' + error.message);
  
      // Verifica se os dados foram retornados corretamente
      if (!data || data.length === 0) {
        throw new Error('Nenhum produto foi retornado após a inserção.');
      }
  
      // Adiciona o produto à lista de produtos localmente
      setProdutos([...produtos, { ...novoProduto, id: data[0].id }]);
  
      // Limpa os campos do formulário
      setNome('');
      setQuantidade(1);
      setPreco('');
      setDescricao('');
      setCategoria('');
  
      alert('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error.message);
      alert('Ocorreu um erro ao adicionar o produto: ' + error.message);
    }
  };
  

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Adicionar Produto</h1>
          <p className="py-6">Preencha as informações do novo produto abaixo.</p>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nome do Produto</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do produto"
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantidade</span>
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              placeholder="Quantidade"
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Preço Unitário</span>
            </label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              min="0"
              step="0.01"
              placeholder="Preço (R$)"
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Descrição (Opcional)</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do produto"
              className="textarea textarea-bordered w-full max-w-xs"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Categoria (Opcional)</span>
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Categoria do produto"
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <button 
            className="btn bg-indigo-600 px-8 py-3 mt-4 text-center font-medium text-white hover:bg-indigo-700"
            onClick={handleAdicionarProduto}
          >
            Adicionar Produto
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdicionarProduto;


