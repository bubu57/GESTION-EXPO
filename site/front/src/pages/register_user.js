import React, { useState } from 'react';
import axios from 'axios';
 

const FormEnregistrements = () => {

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        mail: '',
        date: '',
      });
    
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
      
        fetch('/api/register_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Réponse du serveur:', data);
          })
          .catch(error => {
            console.error('Erreur lors de la requête:', error);
          });
      };



  return(
    <div className='container'>
        <div className='img'></div>
        <div className='form'>
        <center><p className='title'>Enregistrement Utilisateur</p></center>
        <form onSubmit={handleSubmit}>
            <div className='form-block'>
            <div className='form-name'>
                <p className='label'>Prenom</p>
                <p className='label'>Nom</p>
                <p className='label'>Mail</p>
                <p className='label'>Date</p>
            </div>
            <div className='form-input'>
                <div className='div-input'>
                <input
                    className='prenom'
                    type="text"
                    placeholder="Axel"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                />
                </div>
                <div className='div-input'>
                <input
                    className='date_debut'
                    type="text"
                    placeholder="Air"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                />
                </div>
                <div className='div-input'>
                <input
                    className='mail'
                    type="text"
                    placeholder="mail"
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                />
                </div>
                <div className='div-input'>
                <input
                    className='date'
                    type="text"
                    placeholder="21/02/2003"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                </div>
            </div>
            </div>
            <center>
                <button type="submit" className='button-text'>Enregistrer</button>
            </center>
        </form>
        </div>
    </div>
  );
};

export default FormEnregistrements;