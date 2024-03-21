import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Header from './header.js';
import Button from '@mui/material/Button';
import "../styles/graph.css";

const Graph = () => {
  const [expositionData, setExpositionData] = useState({});
  const [visitorData, setVisitorData] = useState({});

  useEffect(() => {
    axios.get('/api/expositions')
        .then(response => {
            console.log(response.data);
            const expoData = {
                labels: response.data.map(expo => expo.nom),
                datasets: [{
                    label: 'Nombre d\'expositions créées',
                    data: response.data.map(expo => expo.count),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            };
            setExpositionData(expoData);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données des expositions:', error);
        });

    axios.get('/api/visitors')
        .then(response => {
            const visitorData = {
                labels: response.data.map(visitor => visitor.id_expo),
                datasets: [{
                    label: 'Nombre de visiteurs par exposition',
                    data: response.data.map(visitor => visitor.count),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            };
            setVisitorData(visitorData);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données des visiteurs:', error);
        });
  }, []);

  return (
    <div className='container'>
      <Header />
      <div className='chart'>
        <h2>Nombre d'expositions créées</h2>
        <Bar data={expositionData} />
      </div>
      <div className='chart'>
        <h2>Nombre de visiteurs par exposition</h2>
        <Doughnut data={visitorData} />
      </div>
    </div>
  );
};

export default Graph;
