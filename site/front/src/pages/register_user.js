import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
 

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [text, setText] = useState('')


  useEffect(() => {
    // Charger les données des expositions depuis le serveur
    axios.get('/api/app') // Assurez-vous d'avoir une route '/api/expositions' sur votre serveur
      .then(response => {
        setExpositions(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });
  }, []);




  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date: '',
    id_expo: '',
  });

  const handleExpoChange = (e) => {
    // Mise à jour de l'ID de l'exposition lors de la sélection dans la liste déroulante
    setFormData({
      ...formData,
      id_expo: e.target.value,
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {

    const qrcode_data = `${formData.nom};${formData.prenom};${formData.id_expo}`;
    setText(qrcode_data)

    e.preventDefault();

    if (!formData.id_expo) {
      console.error('Veuillez sélectionner une exposition');
      return;
    }

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
                <p className='label'>expositions</p>
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
                  type="date"
                  placeholder="21/02/2003"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
              />
              </div>
              <select value={formData.id_expo} onChange={handleExpoChange}>
                <option value=""></option>
                {expositions.map((expo, index) => (
                  <option key={index} value={expo.id}>{expo.nom}</option>
                ))}
              </select>
            </div>
            </div>
            <center>
                <button type="submit" className='button-text'>Enregistrer</button>
                <QRCode value ={text} />
            </center>
        </form>
        </div>
    </div>
  );
};

export default FormEnregistrements;