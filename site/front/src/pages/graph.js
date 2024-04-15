import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Chart from 'chart.js/auto';
import Header from './header.js'
import Button from '@mui/material/Button';
import "../styles/graph.css";
import GoogleMapReact from 'google-map-react';
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/map-marker";

const ListesExpos = () => {
  const [expositions, setExpositions] = useState([]);
  const [villeFiltre, setVilleFiltre] = useState('');
  const [dateFiltre, setDateFiltre] = useState('');
  const [heureFiltre, setHeureFiltre] = useState('');
  const [expositionsFiltrees, setExpositionsFiltrees] = useState([]);
  const [nombreExpos, setNombreExpos] = useState(0);
  



  const renderMarkers = () => {
    return expositions.map((expo, index) => (
      <LocationPin
        key={index}
        lat={expo.latitude}
        lng={expo.longitude}
        text={expo.nom}
      />
    ));
  };

  const LocationPin = ({ text }) => (
    <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
      <Icon icon={locationIcon} style={{ color: 'red', fontSize: '24px' }} />
      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{text}</p>
    </div>
  )

  useEffect(() => {
    fetch('/api/map')
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
        setNombreExpos(data.length);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });
  }, []);

  useEffect(() => {
    if (expositionsFiltrees.length === 0) return;

    const ctx = document.getElementById('bar-chart');

    const expoLabels = expositionsFiltrees.map(expo => expo.nom);
    const visiteurData = expositionsFiltrees.map(expo => expo.visiteur);
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: expoLabels,
        datasets: [{
          label: 'Nombre de visiteurs',
          data: visiteurData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [expositionsFiltrees]);
  

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
  

  return (
    <div class='historique-container'>
      <Header></Header>
      <center>
        <div class='historique-div-titre'><p class='historique-titre'>Expositions passées</p></div>
      </center>

      <div class='historique-search'>
        <div class='historique-div-input'>
          <p>Filtrer par ville</p>
          <input
            class='historique-input'
            type="text"
            placeholder="Paris"
            value={villeFiltre}
            onChange={handleVilleInputChange}
          />
        </div>

        <div class='historique-div-input'>
          <p>Filtrer par date</p>
          <input
            class='historique-input'
            type="text"
            placeholder="jj/mm/aaaa"
            value={dateFiltre}
            onChange={handleDateInputChange}
          />
        </div>

        <div class='historique-div-input'>
          <p>Filtrer par heure</p>
          <input
            class='historique-input'
            type="text"
            placeholder="15:30"
            value={heureFiltre}
            onChange={handleHeureInputChange}
          />
        </div>
      </div>
      <center>
        <p className='historique-nb-expo'>Nombre d'expositions créées : {nombreExpos}</p>
        <div class='historique-content'>
          {expositionsFiltrees.map((expo, index) => (
            <div key={index} class='historique-expo'>
              <center><p class='historique-text-expo'>{expo.nom}</p></center>
              <div class='historique-expo-content'>
                <div class='historique-expo-text'>
                    <p class='historique-label'><strong>Type:</strong> {expo.type}</p>
                    <p class='historique-label'><strong>Quota:</strong> {expo.quota}</p>
                    <p class='historique-label'><strong>Date:</strong> {expo.date_debut} - {expo.date_fin}</p>
                    <p class='historique-label'><strong>Horaire:</strong> {expo.heure_debut} - {expo.heure_fin}</p>
                    <p class='historique-label'><strong>Adresse:</strong> {expo.numero} {expo.rue}, {expo.cp} {expo.ville}</p>
                    <p class='historique-label'><strong>Coordonnées:</strong> {expo.latitude}, {expo.longitude}</p>
                    <p class='historique-label'><strong>Nombre de visiteurs:</strong> {expo.visiteur}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <canvas class='historique-canvas' id="bar-chart" width="800" height="400"></canvas>

        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyDsRLiCf-00haCE_rSfT0klkQ9ite7g0z8" }}
            defaultCenter={{ lat: 48.85, lng: 2.35 }}
            defaultZoom={11}
            >
            {/* Appel à la fonction pour afficher les marqueurs */}
            {renderMarkers()}
            </GoogleMapReact>
        </div>
      </center>
    </div>

  );
};

export default ListesExpos;
