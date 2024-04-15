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
        <Link to="/"><Button color="success" variant="text">Acceuil</Button></Link>
        <Link to="/historique"><Button color="success" variant="text">Historique</Button></Link>
        <Link to="/register_user"><Button color="success" variant="text">Inscripription</Button></Link>
        <Link to="/login"><Button color="success" variant="contained">Admin</Button></Link>
      </div>
    </header>
  );
};

export default Header;
