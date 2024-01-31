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
  const expositionQuery = 'SELECT * FROM Exposition';
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
            return { ...exposition, ville: lieu.rue };
          });

          res.json(combinedResults);
        }
      });
    }
  });
});



app.post('/api/enregistrement', (req, res) => {

  const lieuQuery = `
  INSERT INTO Lieu (rue)
  VALUES ("${req.body.lieu}");
  `;

  const expoQuery = `
    INSERT INTO Exposition (quota ,nom, type, date_debut, date_fin)
    VALUES (${req.body.quota} ,"${req.body.nom}", "${req.body.type}", "${req.body.date_debut}", "${req.body.date_fin}");
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
  console.log(req.body);

  const lieuQuery = `
  INSERT INTO Visiteur (nom, prenom, email)
  VALUES ("${req.body.nom}", "${req.body.prenom}", "${req.body.mail}");
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
      });
    });
    res.json({ success: true, message: 'Enregistrement réussi' });
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