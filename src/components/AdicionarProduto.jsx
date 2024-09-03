import React, { useState } from 'react';
import { z } from 'zod';
import supabase from './supabaseClient';
import { useProdutos } from './ProdutoContext.jsx';

const ProdutoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  preco: z.number().positive("Preço deve ser positivo"),
  quantidade: z.number().int().positive("Quantidade deve ser um número inteiro positivo")
});

const AdicionarProduto = ({ onProdutoAdicionado, setGlobalError }) => {
  const { setProdutos } = useProdutos();
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', quantidade: 1 });
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

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
        const produtoInserido = data[0];
        setProdutos(prevProdutos => [...prevProdutos, produtoInserido]);
        onProdutoAdicionado(produtoInserido);
      }

      setNovoProduto({ nome: '', preco: '', quantidade: 1 });

      // Mostrar alerta de sucesso
      setAlertMessage(`${produtoValidado.quantidade} item(ns) adicionado(s) com sucesso!`);
      setAlertType('success');
      setErrors({});

      // Limpar alerta após 3 segundos
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);

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

        // Mostrar alerta de erro
        setAlertMessage('Ocorreu um erro ao adicionar o produto.');
        setAlertType('error');
        
        // Limpar alerta após 3 segundos
        setTimeout(() => {
          setAlertMessage(null);
          setAlertType(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="bg-white shadow-md p-6 w-full p-4 artboard artboard-horizontal">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Adicionar Produto</h2>
      <form onSubmit={(e) => { e.preventDefault(); adicionarProduto(); }}>
        <input
          type="text"
          name="nome"
          value={novoProduto.nome}
          onChange={handleInputChange}
          placeholder="Nome do Produto"
          className={`mb-4 p-2 w-full input input-bordered ${errors.nome ? 'input-error' : ''}`}
          aria-label="Nome do Produto"
        />
        {errors.nome && <p className="text-red-500 text-sm mb-2">{errors.nome}</p>}
        
        <input
          type="number"
          name="preco"
          value={novoProduto.preco}
          onChange={handleInputChange}
          placeholder="Preço"
          className={`mb-4 p-2 w-full input input-bordered ${errors.preco ? 'input-error' : ''}`}
          aria-label="Preço"
        />
        {errors.preco && <p className="text-red-500 text-sm mb-2">{errors.preco}</p>}
        
        <div className="mb-4 flex items-center">
          <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mr-4">Quantidade:</label>
          <div className="flex items-center  border-gray-300 rounded">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setNovoProduto(prev => ({ ...prev, quantidade: Math.max(1, prev.quantidade - 1) }))}
            >-</button>
            <input
              type="number"
              name="quantidade"
              value={novoProduto.quantidade}
              onChange={handleInputChange}
              className="input input-bordered text-center w-16"
              aria-label="Quantidade"
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setNovoProduto(prev => ({ ...prev, quantidade: prev.quantidade + 1 }))}
            >+</button>
          </div>
        </div>
        
        <button type="submit" className="btn bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700">Adicionar Produto</button>
      </form>
      {alertMessage && (
        <div className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-error'} mt-4`}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default AdicionarProduto;

