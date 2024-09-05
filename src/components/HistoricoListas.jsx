import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

const HistoricoListas = () => {
  const [historicoListas, setHistoricoListas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [alerta, setAlerta] = useState({ show: false, nomeArquivo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session?.user) {
          throw new Error('Usuário não autenticado.');
        }

        const { data, error } = await supabase
          .from('historico_listas')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (data) {
          setHistoricoListas(data);
        } else {
          setMensagem('Nenhuma lista encontrada.');
        }
      } catch (error) {
        console.error('Erro ao buscar histórico:', error.message);
        setMensagem('Erro ao buscar o histórico de listas.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  const baixarLista = async (lista) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdf-listas')
        .download(lista.pdf_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lista.nome}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setAlerta({ show: true, nomeArquivo: lista.nome });
      setTimeout(() => setAlerta({ show: false, nomeArquivo: '' }), 3000);
    } catch (error) {
      console.error('Erro ao baixar lista:', error.message);
      alert('Erro ao baixar a lista.');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      {alerta.show && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>Download concluído: {alerta.nomeArquivo}.pdf</span>
          </div>
        </div>
      )}
      <div className="hero-content flex-col lg:flex-row">
        <div className="card w-full max-w-3xl shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold">Histórico de Listas</h2>
            {loading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Carregando histórico...</p>
              </div>
            ) : historicoListas.length > 0 ? (
              <ul>
                {historicoListas.map((lista, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow mb-4">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold">{lista.nome}</h3>
                      <p className="text-gray-600">Criado em: {new Date(lista.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => baixarLista(lista)}
                    >
                      Baixar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{mensagem || 'Não há listas salvas.'}</p>
            )}
            {mensagem && <p className="mt-4 text-error">{mensagem}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoListas;
