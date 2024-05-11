import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import Footer from './footer.js';
import Header from './header.js'
import Form from './register_user.js'
import Button from '@mui/material/Button';
import "../styles/liste_expo.css";

const ListesExpos = () => {
  const [expositions, setExpositions] = useState([]);
  const [villeFiltre, setVilleFiltre] = useState('');
  const [dateFiltre, setDateFiltre] = useState('');
  const [heureFiltre, setHeureFiltre] = useState('');
  const [statutFiltre, setStatutFiltre] = useState(''); // Nouvel état pour le statut sélectionné
  const [expositionsFiltrees, setExpositionsFiltrees] = useState([]);
  const [expositionSelectionnee, setExpositionSelectionnee] = useState(null);
  let [detail, setDetail] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetch('/api/app')
      .then(response => {
        if (!response.ok) {
          console.log(response);
          throw new Error('Erreur lors de la récupération des expositions');
        }
        return response.json();
      })
      .then(data => {
        setExpositions(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });
  }, []);

  const handlefiltres = () => {
    setShowSearch(!showSearch); // Inverser l'état pour afficher ou masquer la section de recherche
  };

  // filtrer par ville
  useEffect(() => {
    // Filtrer les expositions en fonction de la ville
    const expositionsFiltrees = expositions.filter(expo =>
      expo.ville.toLowerCase().includes(villeFiltre.toLowerCase())
    );
    setExpositionsFiltrees(expositionsFiltrees);
  }, [villeFiltre, expositions]);

  const handleVilleInputChange = (e) => {
    setVilleFiltre(e.target.value);
  };

  // filtrer par date
  useEffect(() => {
    // Vérifier si le champ de filtrage contient du texte
    if (dateFiltre.trim() === '') {
      // Afficher toutes les expositions
      setExpositionsFiltrees(expositions);
    } else {
      // Filtrer les expositions en fonction de la date
      const expositionsFiltrees = expositions.filter(expo => {
        const dateFiltreLowerCase = dateFiltre.toLowerCase();
        const dateDebutLowerCase = expo.date_debut.toLowerCase();
        const dateFinLowerCase = expo.date_fin.toLowerCase();
        
        // Vérifier si la date filtrée est comprise entre la date de début et la date de fin de chaque exposition
        return dateDebutLowerCase <= dateFiltreLowerCase && dateFiltreLowerCase <= dateFinLowerCase;
      });
    
      setExpositionsFiltrees(expositionsFiltrees);
    }
  }, [dateFiltre, expositions]);

  const handleDateInputChange = (e) => {
    setDateFiltre(e.target.value);
  };

  // Filtrer par heure
  useEffect(() => {
    // Si l'heure de filtrage est vide, afficher toutes les expositions
    if (!heureFiltre.trim()) {
      setExpositionsFiltrees(expositions);
      return;
    }

    // Ajouter la date actuelle à l'heure de filtrage
    const heureFiltreAvecDate = `01/01/1970 ${heureFiltre}`;

    // Convertir l'heure de filtrage en millisecondes
    const heureFiltreMillisecondes = Date.parse(heureFiltreAvecDate);

    // Filtrer les expositions en fonction de l'heure de début et de fin
    const expositionsFiltrees = expositions.filter(expo => {
      // Convertir les heures de début et de fin en millisecondes
      const heureDebutMillisecondes = Date.parse(`01/01/1970 ${expo.heure_debut}`);
      const heureFinMillisecondes = Date.parse(`01/01/1970 ${expo.heure_fin}`);
      
      // Vérifier si l'heure de filtrage se situe entre l'heure de début et de fin de chaque exposition
      return heureDebutMillisecondes <= heureFiltreMillisecondes && heureFiltreMillisecondes <= heureFinMillisecondes;
    });

    // Mettre à jour les expositions filtrées
    setExpositionsFiltrees(expositionsFiltrees);
  }, [heureFiltre, expositions]);

  const handleHeureInputChange = (e) => {
    setHeureFiltre(e.target.value);
  };

  // Filtrer par statut
  useEffect(() => {
    // Si aucun statut n'est sélectionné, afficher toutes les expositions
    if (!statutFiltre) {
      setExpositionsFiltrees(expositions);
      return;
    }

    // Filtrer les expositions en fonction du statut sélectionné
    const expositionsFiltrees = expositions.filter(expo => getExpoStatus(expo) === statutFiltre);
    
    // Mettre à jour les expositions filtrées
    setExpositionsFiltrees(expositionsFiltrees);
  }, [statutFiltre, expositions]);

  const handleStatutChange = (e) => {
    setStatutFiltre(e.target.value);
  };

  function convertDateToISO(dateInput) {
    const parts = dateInput.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  }

  // Fonction pour obtenir le statut d'une exposition
  const getExpoStatus = (expo) => {
    const now = dayjs().format('YYYY-MM-DD');
    const datedebut = convertDateToISO(expo.date_debut)
    console.log(now, datedebut, `${expo.date_debut}`)
    if (datedebut > now) {
      return 'À venir';
    } else {
      return 'En cours';
    }
  };


  // Fonction pour obtenir la classe CSS du statut d'une exposition
  const getExpoStatusClass = (expo) => {
    const status = getExpoStatus(expo);
    return status === 'À venir' ? 'status-coming' : 'status-in-progress';
  };

  // Fonction pour afficher les détails
  const handleVoirPlusClick = (expo) => {
    if(detail == 0) {
      setExpositionSelectionnee(expo);
      setDetail(1);
    } else {
      setExpositionSelectionnee(null);
      setDetail(0);
    }
  };
  

  return (
    <div className='acceuil-container'>
      <Header></Header>
      <center>
        <div className='acceuil-div-titre'><p className='acceuil-titre'>Listes des expositions</p></div>
      </center>

        <div className='acceuil-content'>
          <Button color="success" variant="text" onClick={() => handlefiltres()}>Filtres</Button>
          {showSearch && (
            <div className='acceuil-search'>
              <div className='acceuil-div-input'>
                <p>Ville</p>
                <input
                  className='acceuil-input'
                  type="text"
                  placeholder="Paris"
                  value={villeFiltre}
                  onChange={handleVilleInputChange}
                />
              </div>

              <div className='acceuil-div-input'>
                <p>Date</p>
                <input
                  className='acceuil-input'
                  type="text"
                  placeholder="jj/mm/aaaa"
                  value={dateFiltre}
                  onChange={handleDateInputChange}
                />
              </div>

              <div className='acceuil-div-input'>
                <p>Heure</p>
                <input
                  className='acceuil-input'
                  type="text"
                  placeholder="15:30"
                  value={heureFiltre}
                  onChange={handleHeureInputChange}
                />
              </div>

              <div className='acceuil-div-input'>
                <p>Statut</p>
                <select
                  className='acceuil-input'
                  value={statutFiltre}
                  onChange={handleStatutChange}
                >
                  <option value="">Tous</option>
                  <option value="À venir">À venir</option>
                  <option value="En cours">En cours</option>
                </select>
              </div>
            </div>
          )}

          {expositionsFiltrees.map((expo, index) => (
            <div key={index} className='acceuil-expo'>
              <div className='acceuil-box-flex'>
                <div className='acceuil-expo-box'>
                  <div className='acceuil-status'>
                    <div className={`status ${getExpoStatusClass(expo)}`}></div>
                    <p className='acceuil-status-txt'>{getExpoStatus(expo)}</p>
                  </div>
                  <p className='acceuil-text-expo'>{expo.nom}</p>
                  <p className='acceuil-description-txt'>{expo.description}</p>
                </div>
                <div className='acceuil-expo-content'>
                  <div className='acceuil-expo-text'>
                    <p className='acceuil-label-type'>Type: {expo.type}</p>
                    <p className='acceuil-label-date'>Date: {expo.date_debut} - {expo.date_fin}</p>
                    <p className='acceuil-label-ville'>Ville: {expo.ville}</p>
                    <p className='acceuil-label-heure'>Horaire: {expo.heure_debut.slice(0, -3)} - {expo.heure_fin.slice(0, -3)}</p>
                    <p className='acceuil-labell'>Adresse: {expo.numero} {expo.rue} {expo.ville} {expo.cp}</p>
                    <p className='acceuil-labell'>Coordonnee: {expo.latitude} {expo.longitude}</p>
                    <p className='acceuil-label-quota'>Places: {expo.quota}</p>
                    <div className='acceuil-maps-box'><a className='acceuil-maps-link' href={"https://www.google.fr/maps/place/" + expo.latitude + "," + expo.longitude}>Voir sur maps</a></div>
                  </div>
                </div>
                <div className='acceuil-boutton-box'>
                  <Button color="success" variant="contained" onClick={() => handleVoirPlusClick(expo)}>S'inscrire</Button>
                </div>
              </div>
              {expositionSelectionnee && expositionSelectionnee.id === expo.id && (
                <div className='acceuil-overlay'>
                <Form expositionf={expo}></Form>
                </div>
              )}
            </div>
          ))}
        </div>
    </div>

  );
};

export default ListesExpos;
