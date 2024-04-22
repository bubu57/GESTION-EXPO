const express = require('express');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'secretkey123';

const pool = mysql.createPool({
  connectionLimit: 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const queryAsync = (query) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(query, (error, results) => {
        connection.release();
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
};

app.use(express.json());
app.use(express.static('front/build'));
app.use(bodyParser.json());

let quotanb = []

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Admin WHERE user = ? AND password = ?';
    const results = await queryAsync(sql, [username, password]);
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


app.get('/api/app', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const expositionQuery = `SELECT *, DATE_FORMAT(date_debut, '%d/%m/%Y') AS date_debut, DATE_FORMAT(date_fin, '%d/%m/%Y') AS date_fin FROM Exposition WHERE date_fin >= '${today}'`;
    const lieuQuery = 'SELECT * FROM Lieu';
    const [expositionResults, lieuResults] = await Promise.all([
      queryAsync(expositionQuery),
      queryAsync(lieuQuery)
    ]);
    const combinedResults = expositionResults.map(exposition => {
      const lieu = lieuResults.find(l => l.id === exposition.id);
      return { ...exposition, ville: lieu.ville, numero: lieu.numero, rue: lieu.rue, cp: lieu.code_postal, latitude: lieu.latitude, longitude: lieu.longitude };
    });
    res.json(combinedResults);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/quota', async (req, res) => {
  try {
    console.log(req.body);
    const expositionQuery = `SELECT * FROM Visiteur WHERE id_expo = ${req.body.id_expo} AND date_entree = '${req.body.date_debut}';`;
    const expositionResults = await queryAsync(expositionQuery);
    res.json({ success: true, message: 'ok' });
  } catch (error) {
    console.error('Erreur lors de la récupération des données de la table Visiteur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/quotanb', (req, res) => {
  res.json({ quotanb });
});

app.post('/api/enregistrement', async (req, res) => {
  try {
    const lieuQuery = `INSERT INTO Lieu (numero, rue, code_postal, ville, latitude, longitude) VALUES ("${req.body.numero}", "${req.body.rue}", "${req.body.code_postal}", "${req.body.ville}", "${req.body.latitude}", "${req.body.longitude}")`;
    const expoQuery = `INSERT INTO Exposition (quota ,nom, type, date_debut, date_fin, heure_debut, heure_fin, estimation, visiteur) VALUES (${req.body.quota}, "${req.body.nom}", "${req.body.type}", "${req.body.date_debut}", "${req.body.date_fin}", "${req.body.heure_debut}", "${req.body.heure_fin}", "${req.body.estimation}", 0)`;
    await queryAsync(lieuQuery);
    await queryAsync(expoQuery);
    res.json({ success: true, message: 'Enregistrement réussi' });
  } catch (error) {
    console.error('Erreur lors de la création d\'une nouvelle expo :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/register_user', async (req, res) => {
  try {
    const lieuQuery = `INSERT INTO Visiteur (nom, prenom, email, id_expo, date_entree, heure) VALUES ("${req.body.nom}", "${req.body.prenom}", "${req.body.mail}", "${req.body.id_expo}", "${req.body.date_debut}", "${req.body.heure}")`;
    await queryAsync(lieuQuery);
    res.json({ success: true, message: 'Enregistrement réussi' });
  } catch (error) {
    console.error('Erreur lors de la création d\'un nouvelle user :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/admins', async (req, res) => {
  try {
    const query = 'SELECT * FROM Admin';
    const results = await queryAsync(query);
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des administrateurs :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des administrateurs' });
  }
});

app.post('/api/admins', async (req, res) => {
  try {
    const query = `INSERT INTO Admin (User, Password) VALUES ('${req.body.username}', '${req.body.password}')`;
    await queryAsync(query);
    res.json({ success: true, message: 'Enregistrement réussi' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'administrateur :' });
  }
});

app.post('/api/dadmins', async (req, res) => {
  try {
    const query = `DELETE FROM Admin WHERE id = ${req.body.id}`;
    await queryAsync(query);
    res.json({ success: true, message: 'Enregistrement réussi' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'administrateur :' });
  }
});

app.post('/api/dexpo', async (req, res) => {
  try {
    const query = `DELETE Exposition, Lieu FROM Exposition INNER JOIN Lieu ON Exposition.id = Lieu.id WHERE Exposition.id = ${req.body.id}`;
    await queryAsync(query);
    res.json({ success: true, message: 'Enregistrement réussi' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'administrateur :' });
  }
});

app.get('/api/map', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const expositionQuery = `SELECT *, DATE_FORMAT(date_debut, '%d/%m/%Y') AS date_debut, DATE_FORMAT(date_fin, '%d/%m/%Y') AS date_fin FROM Exposition WHERE date_fin <= '${today}'`;
    const lieuQuery = 'SELECT * FROM Lieu';
    const [expositionResults, lieuResults] = await Promise.all([
      queryAsync(expositionQuery),
      queryAsync(lieuQuery)
    ]);
    const combinedResults = expositionResults.map(exposition => {
      const lieu = lieuResults.find(l => l.id === exposition.id);
      return { ...exposition, ville: lieu.ville, numero: lieu.numero, rue: lieu.rue, cp: lieu.code_postale, latitude: lieu.latitude, longitude: lieu.longitude };
    });
    res.json(combinedResults);
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour la carte:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '/front/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port: ${PORT}`);
});
