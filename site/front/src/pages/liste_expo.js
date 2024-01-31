import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListesExpos = () => {
  const [expositions, setExpositions] = useState([]);

  useEffect(() => {
    // Charger les données des expositions depuis le serveur
    axios.get('/api/app') // Assurez-vous d'avoir une route '/api/expositions' sur votre serveur
      .then(response => {
        setExpositions(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des expositions:', error);
      });
  }, []);

  // Diviser le tableau d'expositions en deux parties
  const middleIndex = Math.ceil(expositions.length / 2);
  const firstColumn = expositions.slice(0, middleIndex);
  const secondColumn = expositions.slice(middleIndex);
  
  return(
    <div className='1container'>
      <center>
        <div className='div-titre'><p className='titre'>Listes des expositions</p></div>
      </center>

      <div className='search'>
        <p className='text' >Chercher par ville</p>
      </div>
      <center>
        <div className='content'>
          <div className='col'>
            {firstColumn.map((expo, index) => (
              <div key={index} className='expo'>
                <center><p className='text-expo'>{expo.nom}</p></center>
                <div className='expo-content'>
                  <div className='expo-text'>
                    <p className='label-type'>Type: {expo.type}</p>
                    <p className='label-quota'>Quota: {expo.quota}</p>
                    <p className='label-date'>Date: {expo.date_debut} - {expo.date_fin}</p>
                    <p className='label-ville'>Ville: {expo.ville}</p>
                  </div>
                  <div className='spacer'></div>
                  <div className='reserver'>
                    <center><p className='label-reserver'>Voir plus</p></center>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='col'>
            {secondColumn.map((expo, index) => (
              <div key={index} className='expo'>
                <center><p className='text-expo'>{expo.nom}</p></center>
                <div className='expo-content'>
                  <div className='expo-text'>
                    <p className='label-type'>Type: {expo.type}</p>
                    <p className='label-quota'>Quota: {expo.quota}</p>
                    <p className='label-date'>Date: {expo.date_debut} - {expo.date_fin}</p>
                    <p className='label-ville'>Ville: {expo.ville}</p>
                  </div>
                  <div className='spacer'></div>
                  <div className='reserver'>
                    <center><p className='label-reserver'>Voir plus</p></center>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </center>
    </div>

  );
};

export default ListesExpos;