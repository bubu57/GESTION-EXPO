
import React, { useState } from 'react';
import axios from 'axios';
import Header from './header';
import dayjs from 'dayjs';

const EnregistrementExpo = () => {
  const [formData, setFormData] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
    quota: '',
    type: '',
    latitude: '',
    longitude: '',
    numero: '',
    rue: '',
    ville: '',
    code_postale: '',
    heure_debut: '',
    heure_fin: '',
    lieu: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  function convertDateToISO(dateInput) {
    const parts = dateInput.split("/"); 
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    console.log(formattedDate);
    return formattedDate;
  }

  let [datenow, setdatenow] = useState([`${dayjs().format('DD/MM/YYYY')}`]);


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
      const splitedadresse = response.data.results[0].address_components;

      // Mettre à jour les champs 'latitude' et 'longitude' dans l'état local
      setFormData({
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
        numero: splitedadresse[0].long_name,
        rue: splitedadresse[1].long_name,
        ville: splitedadresse[2].long_name,
        code_postale: splitedadresse[6].long_name,
        lieu: adresse,
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de la latitude et de la longitude:', error);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    let check = true;

    if (formData.date_debut > formData.date_fin) {
      alert('La date de fin doit être supérieure ou égale à la date de depart.');
      check = false;
    }

    if (formData.heure_debut > formData.heure_fin) {
      alert('L\'heure de fin doit être supérieure ou égale à l\'heure de depart.');
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
        alert('L\'exposition a bien été enregistree');
      })
      .catch(error => {
        console.error('Erreur lors de la requête:', error);
      });
    }
  };
  
  
  return(<div>
    <Header></Header>
    <div className='container'>
      <div className='img'></div>
      <div className='form'>
        <center><p className='title'>Enregistrement exposition</p></center>
        <form onSubmit={handleSubmit}>
          <div className='form-block'>
            <div className='form-name'>
              <p className='label'>Nom exposition</p>
              <p className='label'>Date debut</p>
              <p className='label'>Date fin</p>
              <p className='label'>heure debut</p>
              <p className='label'>heure fin</p>
              <p className='label'>Quota</p>
              <p className='label'>Genre</p>
              <p className='label'>Adresse</p>
              <p className='label'>Lattitude</p>
              <p className='label'>Longitude</p>
            </div>
            <div className='form-input'>
              <div className='div-input'>
                <input
                  className='nom'
                  type="text"
                  placeholder="Paris exposition"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  className='date_debut'
                  type="date"
                  placeholder="jj-mm-aaaa"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  min = {convertDateToISO(`${datenow}`)}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  className='date_fin'
                  type="date"
                  placeholder="jj-mm-aaaa"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                  min = {convertDateToISO(`${datenow}`)}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  className='heure_debut'
                  type="time"
                  placeholder="Time"
                  name="heure_debut"
                  value={formData.heure_debut}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  className='heure_fin'
                  type="time"
                  placeholder="15:00"
                  name="heure_fin"
                  value={formData.heure_fin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  className='quota'
                  type="text"
                  placeholder="200"
                  name="quota"
                  value={formData.quota}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  className='type'
                  type="text"
                  placeholder="Art"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  id='lieuInput'
                  className='lieu'
                  type="text"
                  placeholder="13 bis rue de paris 54000 paris"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className='div-input'>
                <input
                  className='Lattitude'
                  type="text"
                  placeholder="48.6896627"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className='div-input'>
                <input
                  className='Longitude'
                  type="text"
                  placeholder="6.1880792"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <p className='coordonnee' >* La lattitude et la longitude seront auto completere</p>
            </div>
          </div>
          <center>
              <button type="submit" className='button-text'>Enregistrer</button>
          </center>
        </form>
      </div>
    </div>
    </div>
  );
};

export default EnregistrementExpo;