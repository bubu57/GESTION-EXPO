import React from 'react';
import logo from './logo.svg';
import ButtonProfile from './Monprofil.svg'
import { Link } from 'react-router-dom';
const Header = () =>  {
  return (
   
    <header>
        <div className='logo'><img src={logo}></img> </div>
        <div className='hamburger'>
        <div className='line'> </div>
    <div className='line'></div>
    <div className='line'></div>
        </div>

        <nav className='nav-bar'>
    <ul>
        <li>
            <Link to = "/liste_expo">
            <a href='' className='active'> Accueil </a>
            </Link>
        </li>

        <li>
            <Link to = "/register_user">
            <a href='' className=''> Enregistrement </a>
            </Link>
        </li>

        <li>
            <Link to = "/historique">
            <a href='' className=''> Historique </a>
            </Link>
        </li>

        <li>
            <a href='' className=''> <Link to="/profile"><img src={ButtonProfile}></img></Link></a>
        </li>
    </ul>



        </nav>
</header>


  );
};

export default Header; 