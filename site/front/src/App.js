import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => { 
  const [msg, setMsg] = useState('')
  const HandleClick = async () => {
    const data = await window.fetch('api/app');
    const json = await data.json();
    const msg = json.msg

    setMsg(msg)
  }

  const [expositions, setExpositions] = useState([]);
  const [lieu, setLieu] = useState([]);

  useEffect(() => {
    // Appel à l'API du backend lors du montage du composant
    fetch('/api/app')
      .then(response => response.json())
      .then(data => setExpositions(data))
      .then(data => setLieu(data))
      .catch(error => console.error('Erreur:', error));
  }, []);



  const formatDateString = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={HandleClick}>Bonjour</button>
        <p>{msg}</p>
        <ul>
          {expositions.map(exposition => (
            <li key={exposition.id}>Nom: {exposition.nom}   Date debut:{formatDateString(exposition.date_debut)}   Date fin:{formatDateString(exposition.date_fin)}   Ville:{exposition.ville}   Places:{exposition.quota}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
