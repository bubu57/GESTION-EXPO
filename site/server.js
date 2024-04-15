const express = require('express');
const path = require('path');
const mysql = require('mysql2');  // Ajout du module mysql2
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');

// recuperation du port via .env sinon utilise le port 5000
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'secretkey123';

const connecterBaseDonnees = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données:', err);
      // Réessayer la connexion après un délai
      setTimeout(connecterBaseDonnees, 5000); // Réessayer la connexion après 5 secondes
    } else {
      console.log('Connexion à la base de données réussie');
    }
  });

  return connection;
};

let connection = connecterBaseDonnees();

app.use(express.json())
app.use(express.static('front/build'))
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM Admin WHERE User = ? AND Password = ?';
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  });
});

app.get('/api/app', (req, res) => {
  let connection = connecterBaseDonnees();
  const today = new Date().toISOString().split('T')[0];
  const expositionQuery = `SELECT *, DATE_FORMAT(date_debut, '%d/%m/%Y') AS date_debut, DATE_FORMAT(date_fin, '%d/%m/%Y') AS date_fin FROM Exposition WHERE date_fin >= '${today}'`;
  const lieuQuery = 'SELECT * FROM Lieu';

  connection.query(expositionQuery, (expositionErr, expositionResults) => {
    if (expositionErr) {
      console.error('Erreur lors de la récupération des données de la table exposition:', expositionErr);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
      connection.query(lieuQuery, (lieuErr, lieuResults) => {
        if (lieuErr) {
          console.error('Erreur lors de la récupération des données de la table lieu:', lieuErr);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        } else {
          // Combine les données exposition et lieu
          const combinedResults = expositionResults.map(exposition => {
            const lieu = lieuResults.find(l => l.id === exposition.id);
            return { ...exposition, ville: lieu.ville, numero: lieu.numero, rue: lieu.rue, cp: lieu.code_postale, latitude: lieu.latitude, longitude: lieu.longitude };
          });

          res.json(combinedResults);
        }
      });
    }
  });
});

let quotanb = [];

app.post('/api/quota', (req, res) => {
  let connection = connecterBaseDonnees();
  console.log(req.body);
  const expositionQuery = `SELECT * FROM Visiteur WHERE id_expo = ${req.body.id_expo} AND date_entree = '${req.body.date_debut}';`;

  connection.query(expositionQuery, (expositionErr, expositionResults) => {
    if (expositionErr) {
      console.error('Erreur lors de la récupération des données de la table Visiteur:', expositionErr);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
      quotanb = expositionResults;
      res.json({ success: true, message: 'ok' });
    }
  });
})

app.get('/api/quotanb', (req, res) => {
  res.json({ quotanb });
});



app.post('/api/enregistrement', (req, res) => {

  let connection = connecterBaseDonnees();
  const lieuQuery = `
  INSERT INTO Lieu (numero, rue, code_postal, ville, latitude, longitude)
  VALUES ("${req.body.numero}", "${req.body.rue}", "${req.body.code_postale}", "${req.body.ville}", "${req.body.latitude}", "${req.body.longitude}");
  `;

  const expoQuery = `
    INSERT INTO Exposition (quota ,nom, type, date_debut, date_fin, heure_debut, heure_fin, estimation, visiteur)
    VALUES (${req.body.quota} ,"${req.body.nom}", "${req.body.type}", "${req.body.date_debut}", "${req.body.date_fin}", "${req.body.heure_debut}", "${req.body.heure_fin}", "${req.body.estimation}", 0);
  `;

  // Commencez la transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la création d\'une nouvelle expo' });
      return;
    }

    // Exécutez la première requête (lieuQuery)
    connection.query(lieuQuery, (err, results) => {
      if (err) {
        console.error(err);
        return connection.rollback(() => {
          res.status(500).json({ error: 'Erreur lors de la création d\'une nouvelle expo' });
        });
      }

      // Exécutez la deuxième requête (expoQuery)
      connection.query(expoQuery, (err, results) => {
        if (err) {
          console.error(err);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Erreur lors de la création d\'une nouvelle expo' });
          });
        }

        // Commit si tout s'est bien passé
        connection.commit((err) => {
          if (err) {
            console.error(err);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Erreur lors de la création d\'une nouvelle expo' });
            });
          }

          // Transaction réussie, envoyez la réponse au client
          res.json({ success: true, message: 'Enregistrement réussi' });
        });
      });
    });
  });

});



app.post('/api/register_user', (req, res) => {

  let connection = connecterBaseDonnees();
  const lieuQuery = `
  INSERT INTO Visiteur (nom, prenom, email, id_expo, date_entree, heure)
  VALUES ("${req.body.nom}", "${req.body.prenom}", "${req.body.mail}", "${req.body.id_expo}", "${req.body.date_debut}", "${req.body.heure}");
  `;

  // Commencez la transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la création d\'un nouvelle user' });
      return;
    }

  // Exécutez la requête 
  connection.query(lieuQuery, (err, results) => {
    if (err) {
      console.error(err);
      return connection.rollback(() => {
        res.status(500).json({ error: 'Erreur lors de la création d\'un nouvelle user' });
      });
    }

      // Commit si tout s'est bien passé
      connection.commit((err) => {
        if (err) {
          console.error(err);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Erreur lors de la création d\'un nouvelle user' });
          });
        }
        res.json({ success: true, message: 'Enregistrement réussi' });
      });
    });
  });
});





app.get('/api/admins', (req, res) => {
  let connection = connecterBaseDonnees();
  const query = 'SELECT * FROM Admin';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des administrateurs :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des administrateurs' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/admins', (req, res) => {
  let connection = connecterBaseDonnees();
  const query = `INSERT INTO Admin (User, Password) VALUES ('${req.body.username}', '${req.body.password}')`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la creation de l\'administrateur :', error);
      res.status(500).json({ error: 'Erreur lors de la creation de l\'administrateur :' });
      return;
    }
    res.json({ success: true, message: 'Enregistrement réussi' });
  });
});

app.post('/api/dadmins', (req, res) => {
  let connection = connecterBaseDonnees();
  const query = `DELETE FROM Admin WHERE id = ${req.body.id}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la suppression de l\'administrateur :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'administrateur :' });
      return;
    }
    res.json({ success: true, message: 'Enregistrement réussi' });
  });
});

app.post('/api/dexpo', (req, res) => {
  let connection = connecterBaseDonnees();
  const query = `DELETE Exposition, Lieu FROM Exposition INNER JOIN Lieu ON Exposition.id = Lieu.id WHERE Exposition.id = ${req.body.id}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la suppression de l\'administrateur :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'administrateur :' });
      return;
    }
    res.json({ success: true, message: 'Enregistrement réussi' });
  });
});



app.get('/api/map', (req, res) => {
  let connection = connecterBaseDonnees();
  const today = new Date().toISOString().split('T')[0];
  const expositionQuery = `SELECT *, DATE_FORMAT(date_debut, '%d/%m/%Y') AS date_debut, DATE_FORMAT(date_fin, '%d/%m/%Y') AS date_fin FROM Exposition WHERE date_fin <= '${today}'`;
  const lieuQuery = 'SELECT * FROM Lieu';

  connection.query(expositionQuery, (expositionErr, expositionResults) => {
    if (expositionErr) {
      console.error('Erreur lors de la récupération des données de la table exposition:', expositionErr);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
      connection.query(lieuQuery, (lieuErr, lieuResults) => {
        if (lieuErr) {
          console.error('Erreur lors de la récupération des données de la table lieu:', lieuErr);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        } else {
          // Combine les données exposition et lieu
          const combinedResults = expositionResults.map(exposition => {
            const lieu = lieuResults.find(l => l.id === exposition.id);
            return { ...exposition, ville: lieu.ville, numero: lieu.numero, rue: lieu.rue, cp: lieu.code_postale, latitude: lieu.latitude, longitude: lieu.longitude };
          });

          res.json(combinedResults);
        }
      });
    }
  });
});



app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '/front/build/index.html'));
})

app.listen(PORT, () => {
  console.log(`server lancé sur le port: ${PORT}`);
})