
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

  return (<div dangerouslySetInnerHTML={{ __html: htmlContent }} />);
};

export default EnregistrementExpo;
