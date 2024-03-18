
USE gestion_expo;

-- Ajout de données dans la table Lieu
INSERT INTO Lieu (numero, rue, ville, code_postal, latitude, longitude)
VALUES 
  (123, 'Rue de la Liberté', 'Paris', 75001, 48.8566, 2.3522),
  (456, 'Main Street', 'New York', 10001, 40.7128, -74.0060),
  (789, 'Oxford Street', 'London', 10000, 51.5074, -0.1278);

-- Ajout de données dans la table Exposition
INSERT INTO Exposition (nom, type, quota, visiteur, date_debut, date_fin, heure_debut, heure_fin)
VALUES 
  ('Exposition Art Moderne', 'Art', 100, 0, '2024-01-01', '2024-01-10', '15:30:00', '17:45:00'),
  ('Salon du Livre', 'Littérature', 150, 0, '2024-02-01', '2024-02-10', '10:30:00', '17:45:00'),
  ('Expo Technologique', 'Technologie', 120, 0, '2024-03-01', '2024-03-10', '07:30:00', '17:45:00');

-- Ajout de données dans la table Visiteur
INSERT INTO Visiteur (nom, prenom, email)
VALUES 
  ('Alice', 'Dupont', 'alice@example.com'),
  ('Bob', 'Martin', 'bob@example.com'),
  ('Charlie', 'Johnson', 'charlie@example.com');

-- Ajout de données dans la table Utilisateur
INSERT INTO Utilisateur (login, mot_de_passe, niveau)
VALUES 
  ('Axel AIR', 'password', '1'),
  ('jean dupont', 'password', '1'),
  ('bubu', 'password', '1');