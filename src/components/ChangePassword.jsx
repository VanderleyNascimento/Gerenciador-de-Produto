import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../components/supabaseClient';

const SpinnerCircule = () => (
  <span className="loading loading-spinner text-accent"></span>
);

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);  // Estado para armazenar os alertas
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access_token');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: "As senhas não coincidem." });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ access_token: accessToken, password });
      if (error) throw error;

      setAlert({ type: 'success', message: "Senha alterada com sucesso!" });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error("Erro ao alterar a senha: ", error);
      setAlert({ type: 'error', message: "Não foi possível alterar a senha. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Alterar Senha</h1>
            <p className="py-6">Defina sua nova senha.</p>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type} shadow-lg mb-4`}>
              <div>
                <span>{alert.message}</span>
              </div>
            </div>
          )}

          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleChangePassword} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nova Senha</span>
                </label>
                <input
                  type="password"
                  placeholder="nova senha"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirme a Senha</span>
                </label>
                <input
                  type="password"
                  placeholder="confirme a senha"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? <><SpinnerCircule />Carregando</> : 'Alterar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

