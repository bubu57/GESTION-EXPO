import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import "../styles/admin.css";
import Button from '@mui/material/Button';

const Admin = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({ ...newAdminData, [name]: value });
  };

  const handleDeleteExpo = async (id) => {
    try {
      await axios.delete(`/api/expositions/${id}`);
      fetchExpositions();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exposition:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className='admin-container'>
        <h2>Liste des Admins</h2>
        <ul>
          {admins.map(admin => (
            <li key={admin.id}>
              <span>{admin.User}</span>
              <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteAdmin(admin.id)}>Supprimer</Button>
            </li>
          ))}
        </ul>
        <h2>Liste des Expositions</h2>
        <ul>
          {expositions.map(expo => (
            <li key={expo.id}>
              <span>{expo.nom}</span>
              <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteExpo(expo.id)}>Supprimer</Button>
            </li>
          ))}
        </ul>
        <h2>Ajouter un nouvel Admin</h2>
        <div className='add-admin'>
          <input type="text" name="username" placeholder="Nom d'utilisateur" value={newAdminData.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Mot de passe" value={newAdminData.password} onChange={handleChange} />
          <Button variant="contained" onClick={handleAddAdmin}>Ajouter</Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
