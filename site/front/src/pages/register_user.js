import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import emailjs from '@emailjs/browser';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

import Header from './header.js';

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
    date_fin: '',
    id_expo: '',
    heure_expo: '',
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
    const selectedExpoId = e.target.value;
    const selectedExpo = expositions.find(expo => expo.id === selectedExpoId);
    console.log('Selected Expo:', selectedExpo);
    
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
  
    console.log('FormData:', formData);

    const selectedExpo = expositions.find(expo =>
      new Date(expo.date_debut) <= new Date(formData.date_debut) &&
      new Date(expo.date_fin) >= new Date(formData.date_debut)
    );
  
    console.log('Selected Expo:', selectedExpo);
  

    if (!selectedExpo) {
      alert('Aucune exposition correspondante trouvée pour la date sélectionnée.');
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




    function genqrcode() {
      
    }

    await handleSaveQRCodeAsPDF(); 
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
                <p className='label'>Date d'entree</p>
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
                <select value={formData.id_expo} onChange={handleExpoChange}>
                  <option value=""></option>
                  {expositions.map((expo, index) => (
                    <option key={index} value={expo.id} disabled={new Date(formData.date_debut) < new Date(expo.date_debut) || new Date(formData.date_fin) > new Date(expo.date_fin)}>
                      {expo.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <center>
              {formData.prenom && formData.nom && formData.mail && formData.date_debut && (
                <QRCode
                  ref={qrCodeRef}
                  value={`${formData.prenom} ${formData.nom} ${formData.date_debut} ${formData.id_expo}`}
                />
              )}
              <button type="submit" className='button-text'>Enregistrer le QR code en PDF</button>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEnregistrements;
