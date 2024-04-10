import React from 'react';
import logo from '../img/logo.svg';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import "../styles/header.css";

const Header = () =>  {

  return (
    <header className='header'>
      <div className='contt'>
        <div className='logo'><img src={logo} alt="Logo"></img> </div>
        <Link to="/"><p className='navlabel'>Accueil</p></Link>
        <Link to="/historique"><p className='navlabel'>Historique</p></Link>
        <Link to="/login"><Button color="success" variant="contained">Mon profil</Button></Link>
      </div>
    </header>
  );
};

export default Header;
