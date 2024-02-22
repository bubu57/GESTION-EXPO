import React from 'react';
import logo from './logo.svg';
import ButtonProfile from './Monprofil.svg';
import { Link } from 'react-router-dom';

const Header = () =>  {

  const toggleMenu = () => {
    const navBar = document.querySelector('.nav-bar');
    navBar.classList.toggle('open');
  };

  const closeMenu = () => {
    const navBar = document.querySelector('.nav-bar');
    navBar.classList.remove('open');
  };

  // Fermer le menu lorsqu'un lien est cliqué
  document.querySelectorAll('.nav-bar ul li a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  return (
   
    <header>
        <div className='logo'><img src={logo} alt="Logo"></img> </div>
        <div className='hamburger' onClick={toggleMenu}>
          <div className='line'></div>
          <div className='line'></div>
          <div className='line'></div>
        </div>

        <nav className='nav-bar'>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>
                <a href='' className='active'> Accueil </a>
              </Link>
            </li>
            <li>
              <Link to="/register_user" onClick={closeMenu}>
                <a href='' className=''> Enregistrement </a>
              </Link>
            </li>
            <li>
              <Link to="/historique" onClick={closeMenu}>
                <a href='' className=''> Historique </a>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <a href='' className=''> <img src={ButtonProfile} alt="Button Profile"></img> </a>
              </Link>
            </li>
          </ul>
        </nav>
    </header>
  );
};

export default Header;
