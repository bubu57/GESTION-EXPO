import React from 'react';
import logo from '../img/logo.svg';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import "../styles/header.css";

const Header = () =>  {

  return (
    <header className='header-content'>
      <div className='header-label-group'>
        <div className='header-logo'><img className='header-img' src={logo} alt="Logo"></img> </div>
        <Link to="/"><p className='header-label'>Accueil</p></Link>
        <Link to="/historique"><p className='header-label'>Historique</p></Link>
        <Link to="/login"><Button color="success" variant="contained">Admin</Button></Link>
      </div>
    </header>
  );
};

export default Header;
