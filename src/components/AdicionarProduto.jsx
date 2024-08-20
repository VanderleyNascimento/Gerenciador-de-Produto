import { useState } from 'react';
import { z } from 'zod';
import supabase from './supabaseClient';
import { useProdutos } from './ProdutoContext.jsx';

const ProdutoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  preco: z.number().positive("Preço deve ser positivo"),
  quantidade: z.number().int().positive("Quantidade deve ser um número inteiro positivo")
});

const AdicionarProduto = ({ setItemAdicionadoRecentemente }) => {
  const { setProdutos, setGlobalError } = useProdutos();
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', quantidade: 1 });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovoProduto((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarProduto = async () => {
    try {
      const produtoValidado = ProdutoSchema.parse({
        ...novoProduto,
        preco: parseFloat(novoProduto.preco),
        quantidade: parseInt(novoProduto.quantidade, 10)
      });

      const { data, error } = await supabase.from('produtos').insert([produtoValidado]);

      if (error) {
        throw error;
      }

      if (Array.isArray(data)) {
        setProdutos(prevProdutos => [...prevProdutos, ...data]);
      }

      setItemAdicionadoRecentemente(produtoValidado.nome); // Atualiza o item adicionado
      setNovoProduto({ nome: '', preco: '', quantidade: 1 });
      alert(`${produtoValidado.quantidade} item(ns) adicionado(s) com sucesso!`);
      setErrors({});
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Erro ao adicionar produto:', error);
        setGlobalError('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Adicionar Produto</h2>
      <form onSubmit={(e) => { e.preventDefault(); adicionarProduto(); }}>
        <input
          type="text"
          name="nome"
          value={novoProduto.nome}
          onChange={handleInputChange}
          placeholder="Nome do Produto"
          className={`mb-4 p-2 w-full border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded`}
          aria-label="Nome do Produto"
        />
        {errors.nome && <p className="text-red-500 text-sm mb-2">{errors.nome}</p>}
        
        <input
          type="number"
          name="preco"
          value={novoProduto.preco}
          onChange={handleInputChange}
          placeholder="Preço"
          className={`mb-4 p-2 w-full border ${errors.preco ? 'border-red-500' : 'border-gray-300'} rounded`}
          aria-label="Preço"
        />
        {errors.preco && <p className="text-red-500 text-sm mb-2">{errors.preco}</p>}
        
        <div className="mb-4 flex items-center">
          <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mr-4">Quantidade:</label>
          <div className="flex items-center border border-gray-300 rounded">
            <button 
              type="button" 
              onClick={() => setNovoProduto(prev => ({ ...prev, quantidade: Math.max(1, prev.quantidade - 1) }))} 
              className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-l"
              disabled={novoProduto.quantidade === 1}
            >
              -
            </button>
            <span className="px-4 py-2 border-l border-r border-gray-300">{novoProduto.quantidade}</span>
            <button 
              type="button" 
              onClick={() => setNovoProduto(prev => ({ ...prev, quantidade: prev.quantidade + 1 }))} 
              className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-r"
            >
              +
            </button>
          </div>
        </div>
        {errors.quantidade && <p className="text-red-500 text-sm mb-2">{errors.quantidade}</p>}
        
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Adicionar Produto
        </button>
      </form>
    </div>
  );
};

export default AdicionarProduto;