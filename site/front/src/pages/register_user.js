import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import ButtonRegister from '../img/Button-reserved.svg';
import Header from './header.js';
import dayjs from 'dayjs';

const FormEnregistrements = () => {
  const [expositions, setExpositions] = useState([]);
  const [quota, setquota] = useState([]);
  const [quotar, setquotar] = useState([]);

  let [dateDebut, setdateDebut] = useState(["2024/01/01"]);
  let [dateFin, setdateFin] = useState(["2024/01/02"]);

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    date_debut: '',
    id_expo: '',
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
      setdateFin(selectedExpo.date_fin);
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
      const qrCodeData = `${formData.prenom} ${formData.nom} ${dayjs(formData.date_debut).format('DD/MM/YYYY')} ${formData.id_expo}`;
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    let check = false;
    try {
      await axios.post('/api/quota', { id_expo: reqData.id_expo, date_debut: formData.date_debut });

      await axios.get('/api/quotanb')
      .then(response => {
        console.log(response.data.quotanb, quota);
        if (response.data.quotanb >= quota) {
          alert('Ce jour est déjà complet, veuillez choisir un autre jour.');
          return;
        } else {
          check = true;
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });  
      if (check) {
        try {
          console.log(formData);
          await axios.post('/api/register_user', formData);
          console.log('Données soumises avec succès.');
          const qrCodeDataURL = await generateQRCode();
          await handleSaveQRCodeAsPDF(qrCodeDataURL);
        } catch (error) {
          console.error('Erreur lors de la soumission du formulaire:', error);
        }
      }    
    } catch (error) {
      console.error('Erreur lors de la requête vers le serveur :', error);
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
                    type="date"
                    placeholder="jj/mm/aaaa"
                    value={formData.date_debut}
                    onChange={handleDateChange}
                    min = {convertDateToISO(`${dateDebut}`)}
                    max = {convertDateToISO(`${dateFin}`)}
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