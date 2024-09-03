import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './DropdownItem';

const NavBar = () => {
  return (
    <div className="navbar sticky top-0 z-50 bg-primary text-primary-content">
      
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost ">Lista de Produtos</Link>
      </div>
      <div className="flex-none">

        
        <details className="dropdown dropdown-end ">
         <summary className="btn btn-active btn-neutral ">Menu</summary>
           <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow space-y-2 ">
              <li><Link to="/limpar-e-exportar" className="theme-controller btn btn-sm btn-outline btn-block justify-start">Salvar lista</Link></li>
              <li><Link to="/" className="theme-controller btn btn-sm btn-outline btn-block justify-start ">AdIcionar produtos</Link></li>
          </ul>
        </details>
      
      </div>
    </div>
  );
};

export default NavBar;

