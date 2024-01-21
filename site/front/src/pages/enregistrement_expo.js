
import React, { useState } from 'react';
import htmlContent from '../html/enregistrement_expo.html';

const EnregistrementExpo = () => {
  const [formData, setFormData] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
    quota: '',
    type: '',
    lieu: '',
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
  
    fetch('/api/enregistrement', {
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
        <center><p className='title'>Enregistrement exposition</p></center>
        <form onSubmit={handleSubmit}>
          <div className='form-block'>
            <div className='form-name'>
              <p className='label'>Nom exposition</p>
              <p className='label'>Date debut</p>
              <p className='label'>Date fin</p>
              <p className='label'>Quota</p>
              <p className='label'>Genre</p>
              <p className='label'>Adresse</p>
              <p className='label'>Attitude</p>
              <p className='label'>Longitude</p>
            </div>
            <div className='form-input'>
              <div className='div-input'>
                <input
                  className='nom'
                  type="text"
                  placeholder="Paris exposition"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
              <div className='div-input'>
                <input
                  className='date_debut'
                  type="text"
                  placeholder="21/02/2024"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                />
              </div>
              <div className='div-input'>
                <input
                  className='date_fin'
                  type="text"
                  placeholder="22/02/2024"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                />
              </div>
              <div className='div-input'>
                <input
                  className='quota'
                  type="text"
                  placeholder="200"
                  name="quota"
                  value={formData.quota}
                  onChange={handleChange}
                />
              </div>
              <div className='div-input'>
                <input
                  className='type'
                  type="text"
                  placeholder="Art"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                />
              </div>
              <div className='div-input'>
                <input
                  className='lieu'
                  type="text"
                  placeholder="13 bis rue de paris 54000 paris"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <center>
            <div className='button'>
              <button type="submit" className='button-text'>Enregistrer</button>
            </div>
          </center>
        </form>
      </div>
    </div>
  );
};

export default EnregistrementExpo;
