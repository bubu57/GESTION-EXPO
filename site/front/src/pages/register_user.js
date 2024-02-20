import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import emailjs from '@emailjs/browser';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

import Header from './header.js'

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

  const generateQRCode = async () => {
    try {

      const qrCodeImage = await htmlToImage.toPng(qrCodeRef.current);
      setQrcodeData(qrCodeImage);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleSaveQRCodeAsPDF = async () => {
  try {
  
    await generateQRCode();


    if (qrcodeData) {
   
      const doc = new jsPDF();
      doc.addImage(qrcodeData, 'PNG', 10, 10, 50, 50);
      doc.save('qrcode.pdf'); 

      console.log('QR code saved as PDF');
    } else {
      console.error('QR code data is empty.');
    }
  } catch (error) {
    console.error('Error saving QR code as PDF:', error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();


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
              {}
              {formData.prenom && formData.nom && formData.mail && formData.date_debut && formData.date_fin && (
  <QRCode
    ref={qrCodeRef}
    value={`${formData.prenom} ${formData.nom} ${formData.mail} ${formData.date_debut} ${formData.date_fin}`}
  />
)}

            </center>
            {}
            <center>
              <button onClick={handleSaveQRCodeAsPDF}>Enregistrer le QR code en PDF</button>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEnregistrements;
