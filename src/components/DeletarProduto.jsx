import { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import { useProdutos } from './ProdutoContext.jsx';
import debounce from 'lodash.debounce';

const DeletarProduto = () => {
  const { produtos, setProdutos } = useProdutos(); 
  const [nomeBusca, setNomeBusca] = useState('');
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarSugestoes = debounce(async (termoBusca) => {
    if (termoBusca.trim() === '') {
      setSugestoes([]);
      return;
    }

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .ilike('nome', `%${termoBusca}%`);

    if (error) {
      console.error('Erro ao buscar sugestões:', error);
      setError('Erro ao buscar sugestões. Tente novamente.');
    } else {
      setSugestoes(data);
    }
  }, 300);

  useEffect(() => {
    buscarSugestoes(nomeBusca);
  }, [nomeBusca]);

  const deletarProduto = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      setLoading(false);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        setError('Erro ao deletar o produto. Por favor, tente novamente.');
      } else {
        setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        alert('Produto deletado com sucesso.');
        setProdutoEncontrado(null);
        setNomeBusca('');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setLoading(false);
      setError('Erro inesperado ao deletar o produto. Tente novamente.');
    }
  };

  const handleInputChange = (event) => {
    setNomeBusca(event.target.value);
  };

  const handleSelecionarProduto = (produto) => {
    setNomeBusca(produto.nome);
    setProdutoEncontrado(produto);
    setMostrarSugestoes(false);
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-8 mb-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Deletar Produto</h2>
        <div className="relative mb-6"> {/* Ajustei o margin-bottom para mais espaço */}
          <input
            type="text"
            placeholder="Digite o nome do produto"
            value={nomeBusca}
            onChange={handleInputChange}
            className="mb-4 p-3 w-full input input-bordered"
            onFocus={() => setMostrarSugestoes(true)}
            onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)} 
          />
          {mostrarSugestoes && sugestoes.length > 0 && (
            <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-sm z-10">
              <ul>
                {sugestoes.map((produto) => (
                  <li key={produto.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelecionarProduto(produto)}
                  >
                    {produto.nome} - R$ {parseFloat(produto.preco).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {produtoEncontrado && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md">
            <p className="text-gray-800">Produto encontrado: {produtoEncontrado.nome} - R$ {parseFloat(produtoEncontrado.preco).toFixed(2)}</p>
            <button onClick={() => deletarProduto(produtoEncontrado.id)} className="mt-2 w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300" disabled={loading}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>  
        )}

        {error && <div className="text-red-500 mt-4">{error}</div>} 
      </div>
    </div>
  );
};

export default DeletarProduto;

