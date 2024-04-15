import React, { useState } from 'react';
import logo from '../img/logo.svg';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import "../styles/header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header-content ${menuOpen ? 'menu-open' : ''}`}>
      <div className='header-label-group'>
        <div className='header-logo'><img className='header-img' src={logo} alt="Logo"></img> </div>
        <Button color="success" variant="text" onClick={toggleMenu}>Menu</Button>
        <div className="menu-items">
          <Link to="/"><Button color="success" variant="text">Accueil</Button></Link>
          <Link to="/historique"><Button color="success" variant="text">Historique</Button></Link>
          <Link to="/register_user"><Button color="success" variant="text">Inscription</Button></Link>
          <Link to="/login"><Button color="success" variant="contained">Admin</Button></Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

