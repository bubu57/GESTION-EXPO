import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import ButtonRegister from '../img/Button-reserved.svg';
import Header from './header.js';
import dayjs from 'dayjs';

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: null,
    heure: '',
    id_expo: '',
  });

  useEffect(() => {
    axios.get('/api/app')
      .then(response => {
        setExpositions(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleExpoChange = (e) => {
    let selectedExpoId = e.target.value;
    let selectedExpo;
    for (let i = 0; i < expositions.length; i++) {
      if (expositions[i].id == selectedExpoId) {
        selectedExpo = expositions[i];
        break;
      }
    }
    console.log("Exposition trouvée :", selectedExpo);
    if (selectedExpo) {
      const dateDebut = selectedExpo.date_debut;
      const dateFin = selectedExpo.date_fin;
      document.getElementById("dateInput").min = dateDebut;
      document.getElementById("dateInput").max = dateFin;
    }
  };
  

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className='container'>
        <div className='img'></div>
        <div className='form'>
          <center><p className='title'>Enregistrement Utilisateur</p></center>
          <form onSubmit={handleSubmit}>
            <div className='form-block'>
              <div className='form-name'>
                <p className='label'>Prénom</p>
                <p className='label'>Nom</p>
                <p className='label'>Mail</p>
                <p className='label'>Expositions</p>
                <p className='label'>Date d'entrée</p>
                <p className='label'>Heure d'entrée</p>
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
                    required
                  />
                </div>
                <div className='div-input'>
                  <input
                    className='nom'
                    type="text"
                    placeholder="Air"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
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
                    required
                  />
                </div>
                <select className='select-exposition' value={formData.id_expo} onChange={handleExpoChange}>
                  <option value=""></option>
                  {expositions.map((expo) => (
                    <option key={expo.id} value={expo.id}>
                      {expo.nom} - {expo.heure_debut.slice(0, -3)} à {expo.heure_fin.slice(0, -3)} - {expo.date_debut} à {expo.date_fin}
                    </option>
                  ))}
                </select>
                <div className='div-input'>
                  <input
                    className='date_fin'
                    type="text"
                    placeholder="jj/mm/aaaa"
                    value={formData.date_debut}
                    onChange={handleChange}
                    id="dateInput"
                  />
                </div>
              </div>
            </div>
            <center className='button-reserved-registeruser'>
              <button type="submit" className='button-text' >  <img src={ButtonRegister} alt="button"></img></button>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEnregistrements;
