CREATE DATABASE IF NOT EXISTS gestion_expo;

USE gestion_expo;

CREATE TABLE Lieu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT,
    rue VARCHAR(100),
    ville VARCHAR(100),
    code_postal INT,
    latitude FLOAT,
    longitude FLOAT
);

CREATE TABLE Exposition (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    type VARCHAR(50),
    quota INT,
    visiteur INT,
    date_debut VARCHAR(10),
    date_fin VARCHAR(10),
    heure_debut TIME,
    heure_fin TIME
);

CREATE TABLE Visiteur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100),
    date DATE,
    id_expo INT,
    date_entree DATE,
    date_sortie DATE,
    qrcode VARCHAR(100),
    status_entree VARCHAR(20)
);

CREATE TABLE Utilisateur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(100),
    mot_de_passe VARCHAR(100),
    niveau VARCHAR(100),
);

CREATE TABLE Parametre (
    id INT PRIMARY KEY AUTO_INCREMENT
);