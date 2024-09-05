import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../components/supabaseClient';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const SpinnerCircule = () => (
  <span className="loading loading-spinner text-accent"></span>
);

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('lastEmail') || '');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error, data: session } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(session.user);
      localStorage.setItem('lastEmail', email);
      setShowGreeting(true);
      setTimeout(() => {
        setShowGreeting(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      alert("Não foi possível fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      setShowGreeting(true);
      setTimeout(() => {
        setShowGreeting(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Erro ao fazer login com Google: ", error);
      alert("Não foi possível fazer login com o Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {showGreeting && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-3xl font-bold">
              Bem-vindo(a), {user?.user_metadata?.name ? user.user_metadata.name.split(' ')[0] : 'usuário'}!
            </h2>
            <p className="mt-4 text-lg">É um prazer tê-lo(a) de volta!</p>
          </div>
        </div>
      )}
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Login</h1>
            <p className="py-6">Faça login para acessar todas as funcionalidades.</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleEmailLogin} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="email" 
                  className="input input-bordered" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Senha</span>
                </label>
                <input 
                  type="password" 
                  placeholder="senha" 
                  className="input input-bordered" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <label className="label">
                  <Link to="/reset-password" className="label-text-alt link link-hover">
                    Esqueceu a senha?
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? <><SpinnerCircule />Carregando</> : 'Login'}
                </button>
              </div>
            </form>
            <div className="card-body pt-0">
              <div className="divider">OU</div>
              <button onClick={handleGoogleLogin} className="btn btn-outline btn-info" disabled={loading}>
                {loading ? <><SpinnerCircule />Carregando</> : 'Login com Google'}
              </button>
              <div className="mt-4 text-center">
                <Link to="/register" className="link link-hover">
                  Não tem uma conta? Registre-se aqui
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

