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

function get_id_expo() {
  const requette = `
    SELECT id from Exposition;
  `;
  connection.query(requette, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données de la table exposition:', err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
      return results;
    }
  });
}

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



app.post('/api/enregistrement', (req, res) => {
  console.log(req.body);
  res.json({ success: true, message: 'Enregistrement réussi' });

  const lieuQuery = `
  INSERT INTO Lieu (id, rue)
  VALUES (5, "${req.body.lieu}");
  `;

  const expoQuery = `
    INSERT INTO Exposition (id, id_lieu, quota ,nom, type, date_debut, date_fin)
    VALUES (5, 5, ${req.body.quota} ,"${req.body.nom}", "${req.body.type}", "${req.body.date_debut}", "${req.body.date_fin}");
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
          res.json({ success: true });
        });
      });
    });
  });

});



// app.get('/api/app', (req, res) => {
//     res.send({
//         msg: 'Hello world'
//     })
// })

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '/front/build/index.html'));
})

app.listen(PORT, () => {
  console.log(`server lancé sur le port: ${PORT}`);
})