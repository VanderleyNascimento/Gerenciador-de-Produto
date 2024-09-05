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
    <div className="min-h-screen bg-base-200 p-4">
      {alerta.show && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>Download concluído: {alerta.nomeArquivo}.pdf</span>
          </div>
        </div>
      )}
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Histórico de Listas</h1>
        {loading ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Carregando histórico...</p>
          </div>
        ) : historicoListas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicoListas.map((lista, index) => (
              <div key={index} className="card shadow-lg compact bg-base-100">
                <div className="card-body">
                  <h2 className="card-title text-2xl font-semibold">{lista.nome}</h2>
                  <p className="text-gray-500">Criado em: {new Date(lista.created_at).toLocaleString()}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => baixarLista(lista)}
                    >
                      Baixar PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl">{mensagem || 'Não há listas salvas.'}</p>
        )}
        {mensagem && <p className="mt-4 text-error text-center">{mensagem}</p>}
      </div>
    </div>
  );
};

export default HistoricoListas;

