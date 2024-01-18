const express = require('express');
const path = require('path');
const mysql = require('mysql2');  // Ajout du module mysql2
require('dotenv').config()
const app = express();

// recuperation du port via .env sinon utilise le port 5000
const PORT = process.env.PORT || 5000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données:', err);
    } else {
      console.log('Connexion à la base de données réussie');
    }
});

app.use(express.json())
app.use(express.static('front/build'))

app.get('/api/app', (req, res) => {
    const requette = `
      SELECT Exposition.*, Lieu.ville
      FROM Exposition
      JOIN Lieu ON Exposition.id_lieu = Lieu.id
    `;
    connection.query(requette, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des données de la table exposition:', err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
      } else {
        res.json(results)
      }
    });
});

app.get('/api/enregistrement', (req, res) => {
});


// app.get('/api/app', (req, res) => {
//     res.send({
//         msg: 'Hello world'
//     })
// })

app.get('/*', (_, res) => {
    res.sendFile(path.join(__direname, '/front/build/index.html'));
})

app.listen(PORT, () => {
    console.log(`server lancé sur le port: ${PORT}`);
})