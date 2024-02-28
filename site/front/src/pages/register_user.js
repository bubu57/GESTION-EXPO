import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import ButtonReserved from '../img/Button-reserved.svg';
import Header from './header.js';

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
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

  const handleExpoChange = (e) => {
    const selectedExpoId = e.target.value;
    setFormData({
      ...formData,
      id_expo: selectedExpoId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateQRCode = async () => {
    try {
      const qrCodeData = `${formData.prenom} ${formData.nom} ${formData.date_debut} ${formData.id_expo}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw error;
    }
  };

  const handleSaveQRCodeAsPDF = async () => {
    try {
      // Vérifier si les données des expositions sont disponibles
      if (expositions.length === 0) {
        console.error('Aucune donnée d exposition disponible.');
        return;
      }
    
      const qrCodeDataURL = await generateQRCode();
      const doc = new jsPDF();
      
      // Récupérer le nom de l'exposition en fonction de son ID
      const selectedExpo = expositions.find(expo => expo.id === formData.id_expo);
      if (selectedExpo) {
        const nomExposition = `Nom de l'exposition : ${selectedExpo.nom}\n`;
        const dateDebut = `Date de début : ${selectedExpo.date_debut}\n`;
        const dateFin = `Date de fin : ${selectedExpo.date_fin}\n`;
        const lieu = `Lieu : ${selectedExpo.lieu}\n\n`;
        const descriptionText = nomExposition + dateDebut + dateFin + lieu;
        doc.text(descriptionText, 10, 20); // Ajouter la description à partir de la position (10, 20)
      }
    
      // Ajouter la date sélectionnée par l'utilisateur
      const dateSelectionnee = `Date sélectionnée : ${formData.date_debut}\n\n`;
      doc.text(dateSelectionnee, 10, 70);
    
      // Ajouter le nom et prénom de l'utilisateur
      const nomPrenom = `Nom : ${formData.nom}\nPrénom : ${formData.prenom}\n\n`;
      doc.text(nomPrenom, 10, 90);
    
      // Ajouter le texte "Veuillez vous présenter à l'entrée muni de votre QRCode"
      const textePresentation = "Veuillez vous présenter à l'entrée muni de votre QRCode";
      doc.text(textePresentation, 10, 120);
    
      // Ajouter l'image du QR code
      doc.addImage(qrCodeDataURL, 'PNG', 10, 140, 50, 50);
      
      // Sauvegarder le document PDF
      doc.save('qrcode.pdf');
      console.log('QR code sauvegardé en PDF');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du QR code en PDF:', error);
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedExpo = expositions.find(expo =>
        new Date(expo.date_debut) <= new Date(formData.date_debut) &&
        new Date(expo.date_fin) >= new Date(formData.date_debut)
      );
      if (!selectedExpo) {
        alert('Aucune exposition correspondante trouvée pour la date sélectionnée.');
        return;
      }

      await axios.post('/api/register_user', formData);
      console.log('Données soumises avec succès.');
      await handleSaveQRCodeAsPDF();
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
                <p className='label'>Date d'entrée</p>
                <p className='label'>Expositions</p>
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
                <div className='div-input'>
                  <input
                    className='date_debut'
                    type="date"
                    placeholder="21/02/2003"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleChange}
                    required
                  />
                </div>
              
                <select  className='select-exposition' value={formData.id_expo} onChange={handleExpoChange}>
                  <option value=""></option>
                  {expositions.map((expo, index) => (
                    <option key={index} value={expo.id} disabled={new Date(formData.date_debut) < new Date(expo.date_debut) || new Date(formData.date_debut) > new Date(expo.date_fin)}>
                      {expo.nom}
                    </option>
                  ))}
                </select>
              
              </div>
            </div>
            <center className='button-reserved-registeruser'>
              <button type="submit" className='button-text' >  <img src={ButtonReserved} alt="button"></img></button>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEnregistrements;
