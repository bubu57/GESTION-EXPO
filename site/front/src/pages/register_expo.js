import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import "../styles/login.css";
import "../styles/register_expo.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [showEnregistrementExpo, setShowEnregistrementExpo] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [expositions, setExpositions] = useState([]);
  const [newAdminData, setNewAdminData] = useState({ username: '', password: '' });
  const [suggestions, setSuggestions] = useState([]);

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

  function convertDateToISO(dateInput) {
    const parts = dateInput.split("/"); 
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    console.log(formattedDate);
    return formattedDate;
  }

  let [datenow, setdatenow] = useState([`${dayjs().format('DD/MM/YYYY')}`]);

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
    setFormData({
      ...formData,
      lieu: suggestion,
    });
    setSuggestions([]);
    await getLatitudeLongitude(suggestion);
  };

  const getLatitudeLongitude = async (adresse) => {
    const apiKey = 'AIzaSyDsRLiCf-00haCE_rSfT0klkQ9ite7g0z8';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const location = response.data.results[0].geometry.location;
      const splitedadresse = response.data.results[0].address_components;

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

  const handleSubmitExpo = (e) => {
    e.preventDefault();
    let check = true;

    if (formData.date_debut > formData.date_fin) {
      alert('La date de fin doit être supérieure ou égale à la date de départ.');
      check = false;
    }

    if (formData.heure_debut > formData.heure_fin) {
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

  const handleShowEnregistrementExpo = () => {
    setShowEnregistrementExpo(true);
  };

  return (
    <div>
      <Header />
      {isLoginFormVisible && (
        <div className='form'>
          <center><p className='title'>Connexion</p></center>
          <form onSubmit={handleSubmit}>
            <div className='form-block'>
              <div className='div-input'>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='div-input'>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
            </div>
            <center>
              <div className='but'>
                <Button color="success" variant="contained" type="submit" >Se connecter</Button>
              </div>
            </center>
          </form>
        </div>
      )}

      {isAdminVisible && (
        <div className='admin-container'>
          <h2>Liste des Admins</h2>
          <ul>
            {admins.map(admin => (
              <li key={admin.id}>
                <span>{admin.User}</span>
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
          <div className='but'>
            <Link to="/register_expo"><Button color="success" variant="contained">Ajouter une expo</Button></Link>
          </div>
          <h2>Ajouter un nouvel Admin</h2>
          <div className='add-admin'>
            <input type="text" name="username" placeholder="Nom d'utilisateur" value={newAdminData.username} onChange={handleeChange} />
            <input type="password" name="password" placeholder="Mot de passe" value={newAdminData.password} onChange={handleeChange} />
            <div className='but'>
              <Button color="success" variant="contained" onClick={handleAddAdmin}>Ajouter</Button>
            </div>
          </div>
        </div>
      )}

      {showEnregistrementExpo && (
        <div className='form'>
          <center><p className='title'>Enregistrement exposition</p></center>
          <form onSubmit={handleSubmitExpo}>
            <div className='form-block'>
              <div className='form-input'>
                <div className='div-input'>
                  <p className='label'>Nom exposition</p>
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
                  <p className='label'>Date début</p>
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
                  <p className='label'>Date fin</p>
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
                  <p className='label'>Heure début</p>
                  <input
                    className='heure_debut'
                    type="time"
                    placeholder="Heure début"
                    name="heure_debut"
                    value={formData.heure_debut}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='div-input'>
                  <p className='label'>Heure fin</p>
                  <input
                    className='heure_fin'
                    type="time"
                    placeholder="Heure fin"
                    name="heure_fin"
                    value={formData.heure_fin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='div-input'>
                  <p className='label'>Estimation durée en min</p>
                  <input
                    className='estimation'
                    type="number"
                    placeholder="30min"
                    name="estimation"
                    value={formData.estimation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='div-input'>
                  <p className='label'>Quota</p>
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
                  <p className='label'>Type</p>
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
                  <p className='label'>Adresse</p>
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
                  <p className='label'>Latitude</p>
                  <input
                    className='latitude'
                    type="text"
                    placeholder="48.6896627"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className='div-input'>
                  <p className='label'>Longitude</p>
                  <input
                    className='longitude'
                    type="text"
                    placeholder="6.1880792"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <p className='coordonnee' >* La latitude et la longitude seront auto-complétées</p>
              </div>
            </div>
            <center>
              <div className='but'>
                <Button color="success" variant="contained" type="submit" >Enregistrer</Button>
              </div>
            </center>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
