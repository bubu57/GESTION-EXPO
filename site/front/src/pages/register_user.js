import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import Button from '@mui/material/Button';
import Header from './header.js';
import dayjs from 'dayjs';
import "../styles/register_user.css"

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [quota, setquota] = useState([]);

  let [dateDebut, setdateDebut] = useState(["2024/01/01"]);
  let [dateFin, setdateFin] = useState(["2024/01/02"]);
  let [estimation, setestimation] = useState([120]);
  let [heureliste, setheurelist] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  let [ heured, setHeured] = useState('');
  let [ heuref, setHeuref] = useState('');

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
    id_expo: '',
    heure: '',
  });

  const [reqData, setreqData] = useState({
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
    let selectedExpoId = e.target.value;
    let selectedExpo;

    for (let i = 0; i < expositions.length; i++) {
      if (expositions[i].id == selectedExpoId) {
        selectedExpo = expositions[i];
        break;
      }
    }
    if (selectedExpo) {
      setquota(selectedExpo.quota);
      setdateDebut(selectedExpo.date_debut);
      if (convertDateToISO(selectedExpo.date_debut) > convertDateToISO(dayjs().format('YYYY/MM/DD'))) {
        setdateDebut(dayjs().format('YYYY/MM/DD'));
      }

      setdateFin(selectedExpo.date_fin);
      setHeured(selectedExpo.heure_debut);
      setHeuref(selectedExpo.heure_fin);
      setestimation(selectedExpo.estimation);
      setreqData({
        date_debut: selectedExpo.date_debut,
        id_expo: selectedExpo.id
      })
      setFormData({
        ...formData,
        id_expo: selectedExpoId,
      });
    }
  };
  

  const generateQRCode = async () => {
    try {
      const qrCodeData = `${formData.prenom} ${formData.nom} ${dayjs(formData.date_debut).format('YYYY-MM-DD')} ${formData.id_expo} ${formData.heure}`;
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
      let doc = new jsPDF();
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

  // Fonction pour générer la liste d'heures disponibles
  const generateReservationTimes = async (heured, heuref, est, datee) => {
    const step = parseInt(est); // Step en minutes
    const start = new Date(`2000-01-01T${heured}`);
    const end = new Date(`2000-01-01T${heuref}`);
    const schedule = [];
    schedule.push(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    let currentTime = new Date(start);
  
    await axios.post('/api/quota', { id_expo: reqData.id_expo, date_debut: datee });
    await axios.get('/api/quotanb').then(response => {
      while (currentTime < end) {
        if (currentTime.getMinutes() + step >= end) {
          break;
        }
        if (getresa(response.data, currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) === false) {
        } else {
          schedule.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        currentTime.setMinutes(currentTime.getMinutes() + step);
      }
      setheurelist(schedule);
    })
  };

  // Fonction appelée lorsque l'utilisateur choisit une heure
  const handleTimeSelection = (e) => {
    setSelectedTime(e.target.value);
    setFormData({
      ...formData,
      heure: e.target.value,
    });
  };







  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await axios.post('/api/register_user', formData);
      console.log('Données soumises avec succès.');
      const qrCodeDataURL = await generateQRCode();
      await handleSaveQRCodeAsPDF(qrCodeDataURL);
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
                placeholder="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className='div-input'>
              <p>Votre prenom</p>
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
                min = {convertDateToISO(`${dateDebut}`)}
                max = {convertDateToISO(`${dateFin}`)}
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
            <Button variant="contained" type="submit" >Réserver</Button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default FormEnregistrements;