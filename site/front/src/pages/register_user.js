import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import ButtonRegister from '../img/Button-reserved.svg';
import Header from './header.js';

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
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
      const qrCodeData = `${formData.prenom} ${formData.nom} ${formData.date_debut} ${formData.heure} ${formData.id_expo}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw error;
    }
  };

  const handleSaveQRCodeAsPDF = async (qrCodeDataURL) => {
    try {
      if (expositions.length === 0) {
        console.error('Aucune donnée d exposition disponible.');
        return;
      }

      const doc = new jsPDF();

      const selectedExpo = expositions.find(expo => expo.id === formData.id_expo);
      if (selectedExpo) {
        const nomExposition = `Nom de l'exposition : ${selectedExpo.nom}\n`;
        const dateDebut = `Date de début : ${selectedExpo.date_debut}\n`;
        const dateFin = `Date de fin : ${selectedExpo.date_fin}\n`;
        const lieu = `Lieu : ${selectedExpo.lieu}\n\n`;
        const descriptionText = nomExposition + dateDebut + dateFin + lieu;
        doc.text(descriptionText, 10, 20);
      }

      const dateSelectionnee = `Date sélectionnée : ${formData.date_debut}\n`;
      const heureSelectionnee = `Heure sélectionnée : ${formData.heure}\n\n`;
      doc.text(dateSelectionnee, 10, 70);
      doc.text(heureSelectionnee, 10, 80);

      const nomPrenom = `Nom : ${formData.nom}\nPrénom : ${formData.prenom}\n\n`;
      doc.text(nomPrenom, 10, 100);

      const textePresentation = "Veuillez vous présenter à l'entrée muni de votre QRCode";
      doc.text(textePresentation, 10, 130);

      doc.addImage(qrCodeDataURL, 'PNG', 10, 150, 50, 50);

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
        new Date(expo.date_fin) >= new Date(formData.date_debut) &&
        formData.heure >= expo.heure_debut &&
        formData.heure <= expo.heure_fin
      );
      if (!selectedExpo) {
        alert('Aucune exposition correspondante trouvée pour la date et l\'heure sélectionnées.');
        return;
      }

      await axios.post('/api/register_user', formData);
      console.log('Données soumises avec succès.');

      const qrCodeDataURL = await generateQRCode();

      await handleSaveQRCodeAsPDF(qrCodeDataURL);

      await sendEmailWithQRCode(formData.mail, qrCodeDataURL);

    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  const sendEmailWithQRCode = async (email, qrCodeDataURL) => {
    try {
      const response = await axios.post('/api/send_email', {
        email: email,
        qrCodeDataURL: qrCodeDataURL,
      });
      console.log('E-mail envoyé avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      throw error;
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
                <p className='label'>Heure d'entrée</p>
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
                <div className='div-input'>
                  <input
                    className='heure'
                    type="time"
                    placeholder="21:30"
                    name="heure"
                    value={formData.heure}
                    onChange={handleChange}
                    required
                  />
                </div>
                <select  className='select-exposition' value={formData.id_expo} onChange={handleExpoChange}>
                  <option value=""></option>
                  {expositions.map((expo, index) => (
                    <option key={index} value={expo.id} disabled={new Date(formData.date_debut) < new Date(expo.date_debut) || new Date(formData.date_debut) > new Date(expo.date_fin) || (formData.heure < expo.heure_debut || formData.heure > expo.heure_fin)}>
                      {expo.nom}
                    </option>
                  ))}
                </select>
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
