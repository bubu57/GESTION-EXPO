import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import Button from '@mui/material/Button';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import "../styles/register_user.css";
import logo from '../img/logo.png';

const FormEnregistrements = ({expositionf}) => {
  const [dat, setdat] = useState(true);
  const [quota, setQuota] = useState(0);
  const [dateDebut, setdateDebut] = useState("2024/01/01");
  const [dateFin, setdateFin] = useState("2024/01/02");
  const [estimation, setEstimation] = useState(0);
  
  let [heureliste, setheurelist] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [heured, setHeured] = useState('');
  const [heuref, setHeuref] = useState('');
  const [nomexpo, setNomexpo] =  useState('');
  const [Adresse, setAdresse] =  useState('');
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

  
  function recup () {

    const now = dayjs().format('YYYY-MM-DD');
    const datedeb = convertDateToISO(expositionf.date_debut)
    if (datedeb <= now) {
      setdateDebut(dayjs().format('DD/MM/YYYY'))
    } else {
      setdateDebut(expositionf.date_debut);
    }
    setHeured(expositionf.heure_debut);
    setdateFin(expositionf.date_fin);
    setHeuref(expositionf.heure_fin);
    setEstimation(expositionf.estimation);
    setNomexpo(expositionf.nom);
    setAdresse(`${expositionf.numero} ${expositionf.rue} ${expositionf.ville} ${expositionf.cp}`)
    setReqData({
      date_debut: expositionf.date_debut,
      id_expo: expositionf.id
    })
    setFormData({
      ...formData,
      id_expo: expositionf.id,
    });
    setQuota(expositionf.quota);
    setdat(false)
  }

  if (dat == true) {
    recup()
  }

  function generateRandomString (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

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

    const now = dayjs().format('YYYY-MM-DD');
    let status = true;

    if (now == e.target.value) {
      generateReservationTimes(heured, heuref, estimation, e.target.value, status);
    } else {
      status = false;
      generateReservationTimes(heured, heuref, estimation, e.target.value, status);
    }


  };

  function convertDateToISO(dateInput) {
    const parts = dateInput.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  }

  const generateQRCode = async (formDataz) => {
    try {
      if (!formDataz || !formDataz.prenom || !formDataz.nom || !formDataz.date_debut || !formDataz.id_expo || !formDataz.heure) {
        throw new Error('Les données du formulaire sont incomplètes.');
      }
  
      // Création d'une chaîne de données à partir des informations du formulaire
      const qrCodeData = `${formDataz.prenom};${formDataz.nom};${dayjs(formDataz.date_debut).format('YYYY-MM-DD')};${formDataz.id_expo};${formDataz.heure};${formDataz.mail};${formDataz.UserId}`;
      console.log(qrCodeData);
      // Clé de chiffrement
      const key = CryptoJS.enc.Utf8.parse('3759203564904835');
      // IV (Initialisation Vector)
      const iv = CryptoJS.enc.Utf8.parse('3759203564904835');
      // Chiffrement AES
      const encrypted = CryptoJS.AES.encrypt(qrCodeData, key, { iv: iv });
  
      // Génération du QR code avec les données chiffrées
      const qrCodeDataURL = await QRCode.toDataURL(encrypted.toString());
  
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw error;
    }
  };
  

  const handleSaveQRCodeAsPDF = async (qrCodeDataURL) => {
    try {
      
      // Création d'un nouveau document PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Logo
      const logoImg = new Image();
      logoImg.src = logo;
      
      // En-tête
      doc.addImage(logoImg, 'png', 10, 10, 20, 20); // Ajout du logo
      doc.setFontSize(18);
      doc.text("Votre Réservation", 40, 20); // Titre
      
      // Pied de page
      const footerText = "© 2024 gestion exposition. Tous droits réservés.";
      doc.setFontSize(10);
      doc.text(footerText, 105, 280); // Positionnez le texte du pied de page

      doc.setFontSize(12);
      const dateSelectionnee = `Bonjour ${formData.prenom} ${formData.nom},\n\ngestion exposition vous donne rendez vous à ${nomexpo}\nle ${dayjs(formData.date_debut).format('DD/MM/YYYY')} à ${formData.heure}\nau ${Adresse}`;
      doc.text(dateSelectionnee, 10, 50);

      const mess = `Veuillez vous présenter a l'entrée avec votre QR-Code, une plage de 10 min vous est accorder pour\nscanner votre QR-Code`;
      doc.text(mess, 10, 100);
      
      // Ajoutez une image QR code
      doc.addImage(qrCodeDataURL, 'PNG', 10, 120, 50, 50); // Positionnez le QR code
      
      // Enregistrer le document PDF
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
    return(count);
  }
  

  function removePastTimes(schedule) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
    const filteredSchedule = schedule.filter(timeSlot => {
      const [time, ] = timeSlot.split(' - ');
      const [hour, minute] = time.split(':').map(Number);
  
      if (hour > currentHour || (hour === currentHour && minute >= currentMinute)) {
        return true;
      }
      return false;
    });
  
    return filteredSchedule;
  }

  
  const generateReservationTimes = async (heured, heuref, est, datee, now) => {
    const step = estimation
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
        let checkplace = getresa(response.data, currentTimeString);
        let nbplaces = quota - checkplace;
        if (checkplace >= quota) {
        } else {
          schedule.push(`${currentTimeString} - ${nbplaces} place(s) restante(s)`);
        }
        currentTime.setMinutes(currentTime.getMinutes() + step);
      }
      if (now == true) {
        setheurelist(removePastTimes(schedule));
      } else {
        setheurelist(schedule);
      }

    });
  };
  

  // Fonction appelée lorsque l'utilisateur choisit une heure
  const handleTimeSelection = (e) => {
    const heurebrt = e.target.value.slice(0, 5);
    setSelectedTime(e.target.value);
    setFormData({
      ...formData,
      heure: heurebrt,
    });
  };

  const sendMail = async (updatedFormData) => {
    const { nom, prenom, mail, subject, date_debut, id_expo, heure } = formData;
    const qrCodeDataURL = await generateQRCode(updatedFormData); // Générer le QR code
  
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

      // Générer le UserID aléatoire
      const UserId = generateRandomString(32);
      console.log(UserId);

      // Ajouter le UserID à formData
      const updatedFormData = {
        ...formData,
        UserId: UserId,
      };

      console.log(updatedFormData)

      // Enregistrer les données dans la base de données
      const response = await fetch('/api/register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement des données dans la base de données');
      }

      const qrCodeDataURL = await generateQRCode(updatedFormData);
      await handleSaveQRCodeAsPDF(qrCodeDataURL);
      
      // Envoyer l'email après l'enregistrement des données
      await sendMail(updatedFormData);
      console.log('Données enregistrées dans la base de données avec succès');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
  
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };
  

  return (
    <div>
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
            <div className='div-input'>
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
            <Button color="success" variant="contained" type="submit">Réserver</Button>
          </center>
        </form>
    </div>
  );
};

export default FormEnregistrements;