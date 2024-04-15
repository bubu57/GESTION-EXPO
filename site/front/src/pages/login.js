import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './header.js';
import Button from '@mui/material/Button';
import "../styles/login.css";
import "../styles/admin.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

  useEffect(() => {
    fetchAdmins();
    fetchExpositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);
      localStorage.setItem('token', response.data.token);
      setIsLoginFormVisible(false);
      setIsAdminVisible(true);
    } catch (error) {
      console.log(error);
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const [admins, setAdmins] = useState([]);
  const [expositions, setExpositions] = useState([]);
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchAdmins();
    fetchExpositions();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des admins:', error);
    }
  };

  const fetchExpositions = async () => {
    try {
      const response = await axios.get('/api/app');
      setExpositions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des expositions:', error);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.post('/api/dadmins', { id: id});
      fetchAdmins();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      await axios.post('/api/admins', newAdminData);
      fetchAdmins();
      setNewAdminData({ username: '', password: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'admin:', error);
    }
  };

  const handleeChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({ ...newAdminData, [name]: value });
  };

  const handleDeleteExpo = async (id) => {
    try {
      await axios.post(`/api/dexpo`, { id: id});
      fetchExpositions();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exposition:', error);
    }
  };



  return (
    <div>
      <Header />
      {isLoginFormVisible && (
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
                <Button color="success" variant="contained" type="submit" >Se connecter</Button>
              </div>
            </center>
          </form>
        </div>
      )}

      {isAdminVisible && (
      <div className='admin-container'>
      <h2>Liste des Admins</h2>
      <ul>
        {admins.map(admin => (
          <li key={admin.id}>
            <span>{admin.User}</span>
            <Button variant="text" size="small" color="error" onClick={() => handleDeleteAdmin(admin.id)}>X</Button>
          </li>
        ))}
      </ul>
      <h2>Liste des Expositions</h2>
      <ul>
        {expositions.map(expo => (
          <li key={expo.id}>
            <span>{expo.nom}</span>
            <Button variant="text" size="small" color="error" onClick={() => handleDeleteExpo(expo.id)}>X</Button>
          </li>
        ))}
      </ul>
      <div className='but'>
        <Link to="/register_expo"><Button variant="contained">Ajouter une expo</Button></Link>
      </div>
      <h2>Ajouter un nouvel Admin</h2>
      <div className='add-admin'>
        <input type="text" name="username" placeholder="Nom d'utilisateur" value={newAdminData.username} onChange={handleeChange} />
        <input type="password" name="password" placeholder="Mot de passe" value={newAdminData.password} onChange={handleeChange} />
        <div className='but'>
          <Button color="success" variant="contained" onClick={handleAddAdmin}>Ajouter</Button>
        </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default Login;
