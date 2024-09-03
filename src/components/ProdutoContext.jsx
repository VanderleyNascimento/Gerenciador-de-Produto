// ProdutoContext.jsx
import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import supabase from './supabaseClient';

const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [globalError, setGlobalError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*');

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        setGlobalError('Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.');
      } else {
        setProdutos(data);
      }
      setLoading(false);
    };

    fetchProdutos();
  }, []);

  const value = useMemo(() => ({
    produtos,
    setProdutos,
    globalError,
    setGlobalError,
    loading
  }), [produtos, globalError, loading]);

  return (
    <ProdutoContext.Provider value={value}>
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

