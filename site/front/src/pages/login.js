import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './header.js';
import Button from '@mui/material/Button';
import "../styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);


  // ------------------------- RGISTER EXPO ----------------------------
  const [expoformData, exposetFormData] = useState({
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


  const expohandleChange = (e) => {
    const { name, value } = e.target;
    exposetFormData({
      ...expoformData,
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
    exposetFormData({
      ...expoformData,
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
      exposetFormData({
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


  const expohandleSubmit = (e) => {
    e.preventDefault();
    
    let check = true;

    if (expoformData.dateDebut > expoformData.dateFin) {
      alert('La date de fin doit être supérieure ou égale à la date de départ.');
      check = false;
    }

    if (expoformData.heureDebut > expoformData.heureFin) {
      alert('L\'heure de fin doit être supérieure ou égale à l\'heure de départ.');
      check = false;
    }

    if (check) {
      fetch('/api/enregistrement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expoformData),
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

  // ------------------------- RGISTER EXPO ----------------------------

















  useEffect(() => {
    fetchAdmins();
    fetchExpositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);
      localStorage.setItem('token', response.data.token);
      setIsLoginFormVisible(false);
      setIsAdminVisible(true);
    } catch (error) {
      console.log(error);
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const [admins, setAdmins] = useState([]);
  const [expositions, setExpositions] = useState([]);
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchAdmins();
    fetchExpositions();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des admins:', error);
    }
  };

  const fetchExpositions = async () => {
    try {
      const response = await axios.get('/api/app');
      setExpositions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des expositions:', error);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.post('/api/dadmins', { id: id});
      fetchAdmins();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      await axios.post('/api/admins', newAdminData);
      fetchAdmins();
      setNewAdminData({ username: '', password: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'admin:', error);
    }
  };

  const handleeChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({ ...newAdminData, [name]: value });
  };

  const handleDeleteExpo = async (id) => {
    try {
      await axios.post(`/api/dexpo`, { id: id});
      fetchExpositions();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exposition:', error);
    }
  };

  return (
    <div>
      <Header />
      {isLoginFormVisible && (
        <div className='login-form'>
          <center><p className='login-title'>Connexion</p></center>
          <form onSubmit={handleSubmit}>
            <div className='login-form-block'>
              <div className='login-div-input'>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='login-div-input'>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="login-error">{error}</p>}
            </div>
            <center>
              <div className='login-but'>
                <Button color="success" variant="contained" type="submit" >Se connecter</Button>
              </div>
            </center>
          </form>
        </div>
      )}

      {isAdminVisible && (
        <div>
        <div className='login-admin-container'>
          <h2>Liste des Admins</h2>
          <ul>
            {admins.map(admin => (
              <li key={admin.id}>
                <span>{admin.user}</span>
                <Button variant="text" size="small" color="error" onClick={() => handleDeleteAdmin(admin.id)}>X</Button>
              </li>
            ))}
          </ul>
          <h2>Liste des Expositions</h2>
          <ul>
            {expositions.map(expo => (
              <li key={expo.id}>
                <span>{expo.nom}</span>
                <Button variant="text" size="small" color="error" onClick={() => handleDeleteExpo(expo.id)}>X</Button>
              </li>
            ))}
          </ul>
          <div className='login-but'>
            <Link to="/register_expo"><Button color="success" variant="contained">Ajouter une expo</Button></Link>
          </div>
          <h2>Ajouter un nouvel Admin</h2>
          <div className='login-add-admin'>
            <input type="text" name="username" placeholder="Nom d'utilisateur" value={newAdminData.username} onChange={handleeChange} />
            <input type="password" name="password" placeholder="Mot de passe" value={newAdminData.password} onChange={handleeChange} />
            <div className='login-but'>
              <Button color="success" variant="contained" onClick={handleAddAdmin}>Ajouter</Button>
            </div>
          </div>
        </div>


        


        <div className='register_expo-form'>
        <center><p className='register_expo-title'>Enregistrement exposition</p></center>
        <form onSubmit={expohandleSubmit}>
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
                  onChange={expohandleChange}
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
      )}
    </div>
  );
};

export default Login;
