CREATE DATABASE IF NOT EXISTS gestion_expo;

USE gestion_expo;

CREATE TABLE Exposition (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    type VARCHAR(50),
    lieux VARCHAR(100),
    quota INT,
    visiteur INT,
    date_debut DATE,
    date_fin DATE,
    id_lieu INT
);

CREATE TABLE Visiteur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visiteur VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE Inscription (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_exposition INT,
    id_visiteur INT,
    date_entree DATE,
    date_sortie DATE,
    qrcode VARCHAR(100),
    status_entree VARCHAR(20)
);

CREATE TABLE Lieu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT,
    rue VARCHAR(100),
    ville VARCHAR(100),
    code_postal INT,
    latitude FLOAT,
    longitude FLOAT
);

CREATE TABLE Utilisateur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(100),
    mot_de_passe VARCHAR(100),
    niveau VARCHAR(100)
);

CREATE TABLE Parametre (
    id INT PRIMARY KEY AUTO_INCREMENT
    -- Ajoutez vos colonnes pour les paramètres ici
);
