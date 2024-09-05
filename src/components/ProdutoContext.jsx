// ProdutoContext.jsx
import React, { createContext, useContext, useState } from 'react';
import supabase from './supabaseClient';

const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [globalError, setGlobalError] = useState('');

  const salvarHistoricoLista = async (nomeLista, produtos) => {
    try {
      const { error } = await supabase
        .from('historico_listas')
        .insert([{ nome: nomeLista, produtos }]);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar histórico de listas:', error.message);
    }
  };

  return (
    <ProdutoContext.Provider value={{ produtos, setProdutos, globalError, setGlobalError, salvarHistoricoLista }}>
      {children}
    </ProdutoContext.Provider>
  );
};

export const useProdutos = () => useContext(ProdutoContext);



