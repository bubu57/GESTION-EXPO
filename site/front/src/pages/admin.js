import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import "../styles/admin.css";
import Button from '@mui/material/Button';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '' });

  useEffect(() => {
    fetch('/api/admins')
      .then(data => {
        setAdmins(data.data);
        console.log(data.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des admins:', error);
      });
  }, []);

  const handleDeleteAdmin = async (id) => {

  };

  const handleAddAdmin = async () => {

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({ ...newAdminData, [name]: value });
  };

  return (
    <div>
      <Header />
      <div className='admin-container'>
        <h2>Liste des Admins</h2>
        <ul>
          {admins.map((index, admin) => (
            <li key={index}>
              <span>{admin.username}</span>
              <Button variant="contained" onClick={() => handleDeleteAdmin(admin.id)}>Supprimer</Button>
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