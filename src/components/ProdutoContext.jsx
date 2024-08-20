import { createContext, useState, useEffect, useContext } from 'react';
import supabase from './supabaseClient';

const ProdutoContext = createContext();


export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [globalError, setGlobalError] = useState(null); // Para erros globais

  useEffect(() => {
    const fetchProdutos = async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*');

      if (error) {
        console.error('Erro ao buscar produtos:', error.message);
        setGlobalError('Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.');
      } else {
        setProdutos(data);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <ProdutoContext.Provider value={{ produtos, setProdutos, globalError, setGlobalError }}>
      {children}
    </ProdutoContext.Provider>
  );
};

export const useProdutos = () => {
  const context = useContext(ProdutoContext);
  if (context === undefined) {
    throw new Error('useProdutos deve ser usado dentro de um ProdutoProvider');
  }
  return context;
};

export default ProdutoContext;