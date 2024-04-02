import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import Button from '@mui/material/Button';
import Header from './header.js';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';
const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [quota, setQuota] = useState([]);
  const [dateDebut, setdateDebut] = useState("2024/01/01");
  const [dateFin, setdateFin] = useState("2024/01/02");
  const [estimation, setEstimation] = useState([]);
  let [heureliste, setheurelist] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [heured, setHeured] = useState('');
  const [heuref, setHeuref] = useState('');
  const [nomexpo, setNomexpo] =  useState('');

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
    id_expo: '',
    heure: '',
    firstName: '', // Ajout des champs de ContactForm
    lastName: '',
    email: '',
    subject: ''
  });

  const [reqData, setReqData] = useState({
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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://smtpjs.com/v3/smtp.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      date_debut: e.target.value,
    });
    generateReservationTimes(heured, heuref, estimation, e.target.value);
  };

  function convertDateToISO(dateInput) {
    const parts = dateInput.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  }

  const handleExpoChange = (e) => {
    const selectedExpoId = e.target.value;
    let selectedExpo;

    for (let i = 0; i < expositions.length; i++) {
      if (expositions[i].id == selectedExpoId) {
        selectedExpo = expositions[i];
        break;
      }
    }
    if (selectedExpo) {
      setQuota(selectedExpo.quota);
      setdateDebut(selectedExpo.date_debut);
      if (convertDateToISO(selectedExpo.date_debut) > convertDateToISO(dayjs().format('YYYY/MM/DD'))) {
        setdateDebut(dayjs().format('YYYY/MM/DD'));
      }

      setdateFin(selectedExpo.date_fin);
      setHeured(selectedExpo.heure_debut);
      setHeuref(selectedExpo.heure_fin);
      setEstimation(selectedExpo.estimation);
      setNomexpo(selectedExpo.nom);
      setReqData({
        date_debut: selectedExpo.date_debut,
        id_expo: selectedExpo.id
      })
      setFormData({
        ...formData,
        id_expo: selectedExpoId,
      });
    }
  };

  const generateQRCode = async (formData) => {
    try {
      if (!formData || !formData.prenom || !formData.nom || !formData.date_debut || !formData.id_expo || !formData.heure) {
        throw new Error('Les données du formulaire sont incomplètes.');
      }
  
      // Création d'une chaîne de données à partir des informations du formulaire
      const qrCodeData = `${formData.prenom};${formData.nom};${dayjs(formData.date_debut).format('YYYY-MM-DD')};${formData.id_expo};${formData.heure}`;
  
      // Génération de la signature numérique à partir des données du formulaire
      const signature = generateSignature(qrCodeData);
  
      // Inclusion de la signature dans les données du QR code
      const qrCodeDataWithSignature = `${qrCodeData};${signature}`;
  
      // Génération du QR code avec les données originales et la signature
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeDataWithSignature);
  
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw error;
    }
  };
  
  // Fonction pour générer la signature numérique
  const generateSignature = (data) => {
    // Utilisation d'une clé secrète pour générer la signature
    const secretKey = 'apagnan';
    const hash = CryptoJS.HmacSHA256(data, secretKey);
    const signature = CryptoJS.enc.Hex.stringify(hash);
    return signature;
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
      const dateSelectionnee = `Date sélectionnée : ${dayjs(formData.date_debut).format('DD/MM/YYYY')}\n`;
      doc.text(dateSelectionnee, 10, 70);
      const nomPrenom = `Nom : ${formData.nom}\nPrénom : ${formData.prenom}\n\n`;
      doc.text(nomPrenom, 10, 100);
      const textePresentation = "Veuillez vous présenter à l'entrée muni de votre QRCode";
      doc.text(textePresentation, 10, 130);
      doc.addImage(qrCodeDataURL, 'PNG', 10, 150, 50, 50);
      doc.save('gestion-exposition.pdf');

      console.log('QR code sauvegardé en PDF');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du QR code en PDF:', error);
    }
  };
   function getresa(list, heure) {
    let count = 0;
    for (let i = 0; i < list.quotanb.length; i++) {
      if (list.quotanb[i].heure && list.quotanb[i].heure.length > 3 && list.quotanb[i].heure.slice(0, -3) === heure) {
        count = count + 1
      }
    }
    if (count >= quota) {
      return false
    }
    return true
  }

  const generateReservationTimes = async (heured, heuref, est, datee) => {
    const step = 10; // Step en minutes, changé à 10 minutes
    const start = new Date(`2000-01-01T${heured}`);
    const end = new Date(`2000-01-01T${heuref}`);
    const schedule = [];
  
    let currentTime = new Date(start);
  
    await axios.post('/api/quota', { id_expo: reqData.id_expo, date_debut: datee });
    await axios.get('/api/quotanb').then(response => {
      while (currentTime < end) {
        const currentTimeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (currentTime.getMinutes() + step >= end || schedule.includes(currentTimeString)) {
          break;
        }
        if (getresa(response.data, currentTimeString) === false) {
        } else {
          schedule.push(currentTimeString);
        }
        currentTime.setMinutes(currentTime.getMinutes() + step);
      }
      setheurelist(schedule);
    });
  };
  
  

  // Fonction appelée lorsque l'utilisateur choisit une heure
  const handleTimeSelection = (e) => {
    setSelectedTime(e.target.value);
    setFormData({
      ...formData,
      heure: e.target.value,
    });
  };



  function getresa(list, heure) {
    let count = 0;
    for (let i = 0; i < list.quotanb.length; i++) {
      if (list.quotanb[i].heure && list.quotanb[i].heure.length > 3 && list.quotanb[i].heure.slice(0, -3) === heure) {
        count = count + 1;
      }
    }
    if (count >= quota) {
      return false;
    }
    return true;
  }

  const sendMail = async () => {
    const { nom, prenom, mail, subject, date_debut, id_expo, heure } = formData;
    const selectedExpo = expositions.find(expo => expo.id === id_expo);
    console.log(selectedExpo); // Ajout du console.log pour vérifier les données d'exposition
    const qrCodeDataURL = await generateQRCode(formData); // Générer le QR code
  
    const formDataWithQRCode = {
      ...formData,
      qrCodeDataURL: qrCodeDataURL // Ajouter l'URL de données du QR code aux données du formulaire
    };
  
    const formDataString = JSON.stringify(formDataWithQRCode);
    const formDataBlob = new Blob([formDataString], { type: "application/json" });
    const formDataFile = new File([formDataBlob], "formData.json", { type: "application/json" });
  
    const formDataAttachment = new FormData();
    formDataAttachment.append("formData", formDataFile);
  
    try {
      await window.Email.send({
        SecureToken: "de3b96be-d360-4f4b-987d-47c0282903be",
        To: mail,
        From: "exposgratuites@gmail.com",
        Subject: "Votre Réservation",
        Body: `Merci pour votre réservation pour l'exposition "${nomexpo}" le ${date_debut} à ${heure} ! Veuillez trouver ci-joint votre QR code.`,
        Attachments: [
          {
            name: "QRCode.png",
            data: qrCodeDataURL // Inclure le QR code en tant que pièce jointe
          }
        ]
      });
      alert("Email envoyé avec succès merci de vérifier vos spams !");
    } catch (error) {
      console.error('Erreur lors de l envoi de l email:', error);
      alert("Une erreur s'est produite lors de l'envoi de l'email");
    }
  };
  

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const qrCodeDataURL = await generateQRCode(formData);
      await handleSaveQRCodeAsPDF(qrCodeDataURL);
      
      // Enregistrer les données dans la base de données
      const response = await fetch('/api/register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement des données dans la base de données');
      }
      
      // Envoyer l'email après l'enregistrement des données
      await sendMail();
  
      console.log('Données enregistrées dans la base de données avec succès');
  
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };
  

  return (
    <div>
      <Header />
      <div className='form'>
        <center><p className='title'>Enregistrement Utilisateur</p></center>
        <form onSubmit={handleSubmit}>
          <div className='form-block'>
            <div className='div-input'>
              <p>Votre nom</p>
              <input
                type="text"
                placeholder="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className='div-input'>
              <p>Votre prénom</p>
              <input
                type="text"
                placeholder="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className='div-input'>
              <p>Votre email</p>
              <input
                type="email"
                placeholder="Mail"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                required
              />
            </div>
            <p>Exposition</p>
            <select className='select-exposition' value={formData.id_expo} onChange={handleExpoChange} name="id_expo">
              <option value="">Sélectionner une exposition</option>
              {expositions.map((expo) => (
                <option key={expo.id} value={expo.id}>
                  {expo.nom} - {expo.heure_debut.slice(0, -3)} à {expo.heure_fin.slice(0, -3)} - {expo.date_debut} à {expo.date_fin}
                </option>
              ))}
            </select>
            <div className='div-input'>
              <p>Date d'entrée</p>
              <input
                type="date"
                placeholder="Date d'entrée"
                value={formData.date_debut}
                onChange={handleDateChange}
                min={convertDateToISO(`${dateDebut}`)}
                max={convertDateToISO(`${dateFin}`)}
              />
            </div>
            <div>
              <p>Heure</p>
              <select className='select-exposition' value={selectedTime} onChange={handleTimeSelection}>
                <option value="">Sélectionner une heure</option>
                {heureliste.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          <center className='button-reserved-registeruser'>
            <Button variant="contained" type="submit">Réserver</Button>
          </center>
        </form>
      </div>
    </div>
  );
};


export default FormEnregistrements;
