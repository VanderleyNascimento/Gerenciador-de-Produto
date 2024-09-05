import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../components/supabaseClient';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Senhas não coincidem.");
      return;
    }
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      alert("Registro realizado com sucesso! Verifique seu email para confirmar a conta.");
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Registrar</h1>
          <p className="py-6">Crie uma nova conta para acessar todas as funcionalidades.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleRegistration} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nome</span>
              </label>
              <input 
                type="text" 
                placeholder="Nome" 
                className="input input-bordered" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="Email" 
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
                placeholder="Senha" 
                className="input input-bordered" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmar Senha</span>
              </label>
              <input 
                type="password" 
                placeholder="Confirmar Senha" 
                className="input input-bordered" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
