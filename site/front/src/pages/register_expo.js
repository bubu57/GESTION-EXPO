import React, { useState } from 'react';
import axios from 'axios';
import Header from './header';
import dayjs from 'dayjs';
import "../styles/register_expo.css";
import Button from '@mui/material/Button';

const RegisterExpo = () => {
  const [formData, setFormData] = useState({
    nom: '',
    dateDebut: '',
    dateFin: '',
    quota: '',
    type: '',
    latitude: '',
    longitude: '',
    numero: '',
    rue: '',
    ville: '',
    codePostal: '',
    heureDebut: '',
    heureFin: '',
    lieu: '',
    estimation: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  function convertDateToISO(dateInput) {
    const parts = dateInput.split("/"); 
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    console.log(formattedDate);
    return formattedDate;
  }

  let [datenow, setDatenow] = useState([`${dayjs().format('DD/MM/YYYY')}`]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'lieu') {
      autoCompleterAdresse(value);
    }
  };

  const autoCompleterAdresse = async (adresse) => {
    // Utiliser l'API de géocodage de Google Maps pour obtenir des suggestions d'adresse
    const apiKey = 'AIzaSyDsRLiCf-00haCE_rSfT0klkQ9ite7g0z8';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const suggestions = response.data.results.map(result => result.formatted_address);
      

      setSuggestions(suggestions);
      console.log(suggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions d\'adresse:', error);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    // Mettre à jour le champ 'lieu' avec la suggestion sélectionnée
    setFormData({
      ...formData,
      lieu: suggestion,
    });

    // Effacer les suggestions après la sélection
    setSuggestions([]);
    await getLatitudeLongitude(suggestion);
  };

  const getLatitudeLongitude = async (adresse) => {
    // Utiliser l'API de géocodage de Google Maps pour obtenir la latitude et la longitude
    const apiKey = 'AIzaSyDsRLiCf-00haCE_rSfT0klkQ9ite7g0z8';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const location = response.data.results[0].geometry.location;
      const splitedAdresse = response.data.results[0].address_components;

      // Mettre à jour les champs 'latitude' et 'longitude' dans l'état local
      setFormData({
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
        numero: splitedAdresse[0].long_name,
        rue: splitedAdresse[1].long_name,
        ville: splitedAdresse[2].long_name,
        codePostal: splitedAdresse[6].long_name,
        lieu: adresse,
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de la latitude et de la longitude:', error);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    let check = true;

    if (formData.dateDebut > formData.dateFin) {
      alert('La date de fin doit être supérieure ou égale à la date de départ.');
      check = false;
    }

    if (formData.heureDebut > formData.heureFin) {
      alert('L\'heure de fin doit être supérieure ou égale à l\'heure de départ.');
      check = false;
    }

    if (check) {
      fetch('/api/enregistrement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Réponse du serveur:', data);
        alert('L\'exposition a bien été enregistrée');
      })
      .catch(error => {
        console.error('Erreur lors de la requête:', error);
      });
    }
  };
  
  
  return (
    <div>
      <Header />
      <div className='register_expo-form'>
        <center><p className='register_expo-title'>Enregistrement exposition</p></center>
        <form onSubmit={handleSubmit}>
          <div className='register_expo-form-block'>
            <div className='register_expo-form-input'>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Nom exposition</p>
                <input
                  className='register_expo-nom'
                  type="text"
                  placeholder="Paris exposition"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Date début</p>
                <input
                  className='register_expo-date_debut'
                  type="date"
                  placeholder="jj-mm-aaaa"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  min = {convertDateToISO(`${datenow}`)}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Date fin</p>
                <input
                  className='register_expo-date_fin'
                  type="date"
                  placeholder="jj-mm-aaaa"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  min = {convertDateToISO(`${datenow}`)}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Heure début</p>
                <input
                  className='register_expo-heure_debut'
                  type="time"
                  placeholder="Heure début"
                  name="heureDebut"
                  value={formData.heureDebut}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Heure fin</p>
                <input
                  className='register_expo-heure_fin'
                  type="time"
                  placeholder="Heure fin"
                  name="heureFin"
                  value={formData.heureFin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Estimation durée en min</p>
                <input
                  className='register_expo-estimation'
                  type="number"
                  placeholder="30"
                  name="estimation"
                  value={formData.estimation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Quota</p>
                <input
                  className='register_expo-quota'
                  type="text"
                  placeholder="200"
                  name="quota"
                  value={formData.quota}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Type</p>
                <input
                  className='register_expo-type'
                  type="text"
                  placeholder="Art"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Adresse</p>
                <input
                  id='lieuInput'
                  className='register_expo-lieu'
                  type="text"
                  placeholder="13 bis rue de Paris, 54000 Paris"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="register_expo-suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Latitude</p>
                <input
                  className='register_expo-latitude'
                  type="text"
                  placeholder="48.6896627"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className='register_expo-div-input'>
                <p className='register_expo-label'>Longitude</p>
                <input
                  className='register_expo-longitude'
                  type="text"
                  placeholder="6.1880792"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <p className='register_expo-coordonnee' >* La latitude et la longitude seront automatiquement complétées</p>
            </div>
          </div>
          <center>
            <div className='register_expo-but'>
              <Button color="success" variant="contained" type="submit" >Enregistrer</Button>
            </div>
          </center>
        </form>
      </div>
    </div>
  );
};

export default RegisterExpo;