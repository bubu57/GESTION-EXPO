
USE gestion_expo;

-- Ajout de données dans la table Lieu
INSERT INTO Lieu (numero, rue, ville, code_postal, latitude, longitude)
VALUES 
  (123, 'Rue de la Liberté', 'Paris', 75001, 48.8566, 2.3522),
  (456, 'Main Street', 'New York', 10001, 40.7128, -74.0060),
  (789, 'Oxford Street', 'London', 10000, 51.5074, -0.1278);

-- Ajout de données dans la table Exposition
INSERT INTO Exposition (nom, type, lieux, quota, visiteur, date_debut, date_fin, id_lieu)
VALUES 
  ('Exposition Art Moderne', 'Art', 1, 100, 0, '2024-01-01', '2024-01-10', 1),
  ('Salon du Livre', 'Littérature', 2, 150, 0, '2024-02-01', '2024-02-10', 2),
  ('Expo Technologique', 'Technologie', 3, 120, 0, '2024-03-01', '2024-03-10', 3);

-- Ajout de données dans la table Visiteur
INSERT INTO Visiteur (visiteur, prenom, email)
VALUES 
  ('Alice', 'Dupont', 'alice@example.com'),
  ('Bob', 'Martin', 'bob@example.com'),
  ('Charlie', 'Johnson', 'charlie@example.com');

-- Ajout de données dans la table Inscription
INSERT INTO Inscription (id_exposition, id_visiteur, date_entree, date_sortie, qrcode, status_entree)
VALUES 
  (1, 1, '2024-01-05', '2024-01-08', 'QR123', 'Entrée autorisée'),
  (2, 2, '2024-02-05', '2024-02-08', 'QR456', 'Entrée autorisée'),
  (3, 3, '2024-03-05', '2024-03-08', 'QR789', 'Entrée autorisée');

-- Ajout de données dans la table Utilisateur
INSERT INTO Utilisateur (login, mot_de_passe, niveau)
VALUES 
  ('Axel AIR', 'password', '1'),
  ('jean dupont', 'password', '1'),
  ('bubu', 'password', '1');

-- Ajout de données dans la table Parametre (si nécessaire)
