import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Header from './header.js'
import Button from '@mui/material/Button';
import "../styles/liste_expo.css";

const ListesExpos = () => {
  const [expositions, setExpositions] = useState([]);

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

  

  return (
    <div className='1container'>
      <Header></Header>
      
    </div>
  );
};

export default ListesExpos;