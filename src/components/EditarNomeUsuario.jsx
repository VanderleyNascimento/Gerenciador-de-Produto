import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

const EditarNomeUsuario = () => {
  const [nome, setNome] = useState('');
  const [nomeAtual, setNomeAtual] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setNomeAtual(user.user_metadata.nome || 'Usuário');
        setNome(user.user_metadata.nome || '');
      }
    };
    fetchUserData();
  }, []);

  const atualizarNome = async () => {
    try {
      const { user, error } = await supabase.auth.updateUser({ data: { nome } });
      if (error) throw error;
      setMensagem('Nome atualizado com sucesso!');
      setNomeAtual(nome);
      setTimeout(() => setMensagem(''), 4000);
    } catch (error) {
      console.error('Erro ao atualizar o nome:', error.message);
      setMensagem('Erro ao atualizar o nome.');
      setTimeout(() => setMensagem(''), 4000);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200 flex flex-col items-center justify-center py-8">
      {mensagem && (
        <div role="alert" className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-error'} fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-full max-w-md z-50`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensagem}</span>
        </div>
      )}

      <div className="w-full max-w-md text-center mb-8">
        <div className="card bg-primary text-white shadow-lg p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold">Olá, {nomeAtual}!</h1>
          <p className="mt-2">Atualize seu nome abaixo:</p>
        </div>
      </div>

      <div className="card w-full max-w-sm shadow-2xl bg-base-100 rounded-lg p-6 mb-4">
        <div className="card-body">
          <h2 className="card-title text-xl font-semibold">Editar Nome de Usuário</h2>
          <input
            type="text"
            placeholder="Digite seu novo nome"
            className="input input-bordered w-full mt-4"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <div className="card-actions mt-4">
            <button className="btn btn-primary w-full" onClick={atualizarNome}>Atualizar Nome</button>
          </div>
        </div>
      </div>

      {/* Footer já existente */}
      <footer className="w-full text-center mt-6">
        <p className="text-gray-600"></p>
      </footer>
    </div>
  );
};

export default EditarNomeUsuario;
