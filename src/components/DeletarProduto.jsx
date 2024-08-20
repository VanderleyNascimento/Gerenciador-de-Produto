import { useState } from 'react';
import supabase from './supabaseClient';
import { useProdutos } from './ProdutoContext.jsx';

const DeletarProduto = () => {
  const { produtos, setProdutos } = useProdutos(); 
  const [nomeBusca, setNomeBusca] = useState('');
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarProduto = () => {
    const termoBusca = nomeBusca.trim().toLowerCase();
    if (termoBusca === '') {
      setProdutoEncontrado(null);
      setSugestoes([]);
      return;
    }

    const produtosEncontrados = produtos.filter(produto => 
      produto.nome.toLowerCase().includes(termoBusca)
    );

    if (produtosEncontrados.length > 0) {
      setProdutoEncontrado(produtosEncontrados[0]); 
      setSugestoes(produtosEncontrados.slice(1, 4)); 
    } else {
      alert('Produto não encontrado.');
      setProdutoEncontrado(null);
      setSugestoes([]);
    }
  };

  const deletarProduto = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      setLoading(false);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        if (error.code === '22P02') { 
          setError('O ID do produto é inválido.');
        } else if (error.code === 'PGRST116') { 
          setError('Você não tem permissão para deletar este produto.');
        } else {
          setError('Ocorreu um erro ao deletar o produto. Por favor, tente novamente mais tarde.');
        }
      } else {
        setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));

        alert('Produto deletado com sucesso.');
        setProdutoEncontrado(null);
        setNomeBusca('');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setLoading(false);
      setError('Ocorreu um erro inesperado ao deletar o produto. Por favor, tente novamente mais tarde.');
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setNomeBusca(value);
  };

  const handleDeletarProduto = () => {
    if (produtoEncontrado) {
      deletarProduto(produtoEncontrado.id);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Deletar Produto</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Nome do produto"
            value={nomeBusca}
            onChange={handleInputChange}
            className="mb-4 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
            onFocus={() => setMostrarSugestoes(true)}
            onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)} 
          />
          {mostrarSugestoes && sugestoes.length > 0 && ( 
            <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-sm z-10">
              <ul>
                {sugestoes.map((produto) => (
                  <li key={produto.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNomeBusca(produto.nome);
                        setProdutoEncontrado(produto);
                        setMostrarSugestoes(false);
                      }}
                  >
                    {produto.nome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button onClick={buscarProduto} className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 mb-4">
          Buscar
        </button>

        {produtoEncontrado && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md">
            <p className="text-gray-800">Produto encontrado: {produtoEncontrado.nome} - R$ {parseFloat(produtoEncontrado.preco).toFixed(2)}</p>
            <button onClick={handleDeletarProduto} className="mt-2 w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300" disabled={loading}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>  
        )}

        {error && <div className="text-red-500 mt-4">{error}</div>} {/* Exibe a mensagem de erro */}
      </div>
    </div>
  );
};

export default DeletarProduto;