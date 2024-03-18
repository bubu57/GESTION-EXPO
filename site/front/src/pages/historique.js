import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Header from './header.js'

const ListesExpos = () => {
  const [expositions, setExpositions] = useState([]);
  const [villeFiltre, setVilleFiltre] = useState('');
  const [dateFiltre, setDateFiltre] = useState('');
  const [heureFiltre, setHeureFiltre] = useState('');
  const [expositionsFiltrees, setExpositionsFiltrees] = useState([]);
  const [expositionSelectionnee, setExpositionSelectionnee] = useState(null);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    // Charger les données des expositions depuis le serveur
    axios.get('/api/app')
      .then(response => {
        setExpositions(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });
  }, []);

  // filtrer par ville
  useEffect(() => {
    const expositionsFiltrees = expositions.filter(expo =>
      expo.ville.toLowerCase().includes(villeFiltre.toLowerCase())
    );
    setExpositionsFiltrees(expositionsFiltrees);
  }, [villeFiltre, expositions]);

  const handleVilleInputChange = (e) => {
    setVilleFiltre(e.target.value);
  };

  // filtrer par date
  const handleDateInputChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date().toISOString().split('T')[0];

    if (selectedDate <= currentDate) {
      setDateError('');
      setDateFiltre(selectedDate);
    } else {
      // Afficher une boîte de dialogue modale avec un message d'avertissement
      window.alert("Attention: Vous avez sélectionné une date future.");
      setDateError('');
      setDateFiltre(selectedDate);
    }
  };

  // filtrer par heure
  useEffect(() => {
    const expositionsFiltrees = expositions.filter(expo =>
      expo.heure_debut.toLowerCase().includes(heureFiltre.toLowerCase())
    );
    setExpositionsFiltrees(expositionsFiltrees);
  }, [heureFiltre, expositions]);

  const handleHeureInputChange = (e) => {
    setHeureFiltre(e.target.value);
  };

  const handleVoirPlusClick = (expo) => {
    setExpositionSelectionnee(expo);
  };

  const handleFermerDetails = () => {
    setExpositionSelectionnee(null);
  };

  return(
    <div className='1container'>
      <Header></Header>
      <center>
        <div className='div-titre'><p className='titre'>Listes des expositions</p></div>
      </center>

      <div className='search'>
        <div className='div-inputt'>
          <p>Filtrer par ville</p>
          <input
            className='input'
            type="text"
            placeholder="Paris"
            value={villeFiltre}
            onChange={handleVilleInputChange}
          />
        </div>

        <div className='div-inputt'>
          <p>Filtrer par date</p>
          <input
              className='input'
              type="date"
              placeholder="mm/dd/yyyy"
              value={dateFiltre}
              onChange={handleDateInputChange}
          />
          {dateError && <p className="error-message">{dateError}</p>}
        </div>

        <div className='div-inputt'>
          <p>Filtrer par heure</p>
          <input
            className='input'
            type="text"
            placeholder="15:30"
            value={heureFiltre}
            onChange={handleHeureInputChange}
          />
        </div>
      </div>
      <center>
        <div className='content'>
          {expositionsFiltrees.map((expo, index) => (
            <div key={index} className='expo'>
              <center><p className='text-expo'>{expo.nom}</p></center>
              <div className='expo-content'>
                <div className='expo-text'>
                  <p className='label-type'>Type: {expo.type}</p>
                  <p className='label-quota'>Quota: {expo.quota}</p>
                  <p className='label-date'>Date: {expo.date_debut} - {expo.date_fin}</p>
                  <p className='label-ville'>Ville: {expo.ville}</p>
                  <p className='label-heure'>Horaire: {expo.heure_debut} - {expo.heure_fin}</p>
                </div>
                <div className='spacer'></div>
                <div className='reserver' onClick={() => handleVoirPlusClick(expo)}>
                  <center><p className='label-reserver'>Voir plus</p></center>
                </div>


                {expositionSelectionnee && expositionSelectionnee.id === expo.id && (
                  <div className='overlay'>
                    <div className='details'>
                      <button onClick={handleFermerDetails}>Fermer</button>
                      <center>
                      <p className='labell'>Nom: {expo.nom}</p>
                      <p className='labell'>Type: {expo.type}</p>
                      <p className='labella'>Quota: {expo.quota}</p>
                      <p className='labell'>Date: {expo.date_debut} - {expo.date_fin}</p>
                      <p className='labell'>Horaire: {expo.heure_debut} - {expo.heure_fin}</p>
                      <p className='labell'>Adresse: {expo.numero} {expo.rue} {expo.ville} {expo.cp}</p>
                      <p className='labell'>Coordonnee: {expo.latitude} {expo.longitude}</p>
                      <Link to="/register_user">
                        <div className='reserver' >
                          <center><p className='label-reserver'>Voir plus</p></center>
                        </div>
                      </Link>
                    </center>
                    </div>
                  </div>
                )}

          
              </div>
            </div>
          ))}
        </div>
      </center>
    </div>

  );
};

export default ListesExpos;
