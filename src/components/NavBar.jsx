import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../components/supabaseClient';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <div className="navbar sticky top-0 z-50 bg-primary text-primary-content">
      <div className="flex-1">
        <a className="btn btn-ghost">
          {user ? `Olá,  ${user.user_metadata.nome}! ✌️😊 ` : 'Usuário: Desconhecido'}
        </a>
      </div>
      <div className="flex-none">
        <details className="dropdown dropdown-end">
          <summary className="btn btn-active btn-neutral">Menu</summary>
          <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow space-y-2">
            {user ? (
              <>
                <li><Link to="/limpar-e-exportar" className="theme-controller btn btn-sm btn-outline btn-block justify-start">Salvar lista</Link></li>
                <li><Link to="/historico-listas" className="theme-controller btn btn-sm btn-outline btn-block justify-start">Histórico</Link></li>
                <li><Link to="/" className="theme-controller btn btn-sm btn-outline btn-block justify-start">Adicionar produtos</Link></li>
                <li><Link to="/editar-nome" className="theme-controller btn btn-sm btn-outline btn-block justify-start">Editar usuário</Link></li>
                <li><button onClick={handleLogout} className="theme-controller btn btn-sm btn-error btn-block justify-start">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="theme-controller btn btn-sm btn-outline btn-block justify-start">Login</Link></li>
            )}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default NavBar;

