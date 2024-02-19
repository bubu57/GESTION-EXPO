import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import Header from './header.js';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'exposgratuites@gmail.com',
    pass: 'gestionexpo2024',
  },
});

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
    date_fin: '',
    id_expo: '',
  });
  const [qrcodeData, setQrcodeData] = useState('');
  const qrCodeRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedStartDate = new Date(formData.date_debut);
    selectedStartDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (selectedStartDate < currentDate) {
      alert('La date de début doit être supérieure ou égale à la date actuelle.');
      return;
    }

    const selectedEndDate = new Date(formData.date_fin);
    selectedEndDate.setHours(0, 0, 0, 0);

    if (selectedEndDate < currentDate) {
      alert('La date de fin doit être supérieure ou égale à la date actuelle.');
      return;
    }

    if (selectedEndDate < selectedStartDate) {
      alert('La date de fin doit être postérieure ou égale à la date de début.');
      return;
    }

    const qrCodeImage = await htmlToImage.toPng(qrCodeRef.current);

    const mailOptions = {
      from: 'exposgratuites@gmail.com',
      to: formData.mail,
      subject: 'Votre QR code pour l\'exposition',
      text: `Bonjour ${formData.prenom} ${formData.nom},\nVoici votre QR code pour l'exposition : ${qrcodeData}`,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeImage.split(';base64,').pop(),
          encoding: 'base64',
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent successfully!', info);
      }
    });

    setFormData({
      prenom: '',
      nom: '',
      mail: '',
      date_debut: '',
      date_fin: '',
      id_expo: '',
    });
  };

  return (
    <div>
      <Header></Header>
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
                <p className='label'>Date de début</p>
                <p className='label'>Date de fin</p>
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
                    className='date_debut'
                    type="date"
                    placeholder="21/02/2003"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleChange}
                  />
                </div>
                <div className='div-input'>
                  <input
                    className='date_fin'
                    type="date"
                    placeholder="21/02/2003"
                    name="date_fin"
                    value={formData.date_fin}
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
              <QRCode ref={qrCodeRef} value={qrcodeData} />
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEnregistrements;
