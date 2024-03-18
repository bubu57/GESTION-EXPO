import React, { useState } from 'react';
import axios from 'axios';
import Header from './header.js';
import "../styles/login.css";
import Button from '@mui/material/Button';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Header />
      <div className='form'>
        <center><p className='title'>Connexion</p></center>
        <form onSubmit={handleSubmit}>
          <div className='form-block'>
            <div className='div-input'>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className='div-input'>
              <input
                type="password"
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
          </div>
          <center>
            <div className='but'>
                <Button variant="contained" type="submit" >Se connecter</Button>
            </div>
          </center>
        </form>
      </div>
    </div>
  );
};

export default Login;
