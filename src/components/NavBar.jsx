import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../components/supabaseClient';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
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

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: '/limpar-e-exportar', label: 'Salvar lista' },
    { path: '/historico-listas', label: 'Histórico' },
    { path: '/', label: 'Adicionar produtos' },
    { path: '/editar-nome', label: 'Editar usuário' },
  ];

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold">
          {user ? `Olá, ${user.user_metadata.nome}! ✌️😊` : 'Bem-vindo!'}
        </a>
      </div>
      <div className="flex-none">
        {/* Mobile menu */}
        <div className="lg:hidden">
          <button className="btn btn-neutral" onClick={handleMenuClick}>
            Menu
          </button>
          {isOpen && (
            <div className="dropdown-content menu bg-gray-800 text-white shadow-lg absolute top-16 right-0 mt-2 rounded-box z-50 w-48">
              {user ? (
                <>
                  {navItems.map(({ path, label }) => (
                    <li key={path} onClick={closeMenu}>
                      <Link to={path} className="menu-item hover:bg-gray-700">{label}</Link>
                    </li>
                  ))}
                  <li onClick={closeMenu}>
                    <button onClick={handleLogout} className="btn btn-error w-full">Logout</button>
                  </li>
                </>
              ) : (
                <li onClick={closeMenu}>
                  <Link to="/login" className="menu-item hover:bg-gray-700">Login</Link>
                </li>
              )}
            </div>
          )}
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-col lg:flex-row">
          <ul className="menu menu-horizontal bg-primary text-primary-content">
            {user ? (
              <>
                {navItems.map(({ path, label }) => (
                  <li key={path} className={location.pathname === path ? 'btn btn-secudary' : ''}>
                    <Link to={path} className="px-4 py-2">{label}</Link>
                  </li>
                ))}
                <li>
                  <button onClick={handleLogout} className="btn btn-error">Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="btn btn-neutral">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;






