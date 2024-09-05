import React, { useState } from 'react';
import supabase from '../components/supabaseClient';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: '/change-password',
      });
      if (error) throw error;
      setMessage('Verifique seu email para redefinir sua senha.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Redefinir Senha</h1>
          <p className="py-6">Insira seu email para receber um link de redefinição de senha.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handlePasswordReset} className="card-body">
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
            <div className="form-control mt-6">
              <button className="btn btn-primary">Enviar Link de Redefinição</button>
            </div>
          </form>
          {message && (
            <div className="alert alert-info">
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;