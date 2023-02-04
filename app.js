const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

require('dotenv').config()


// Configuration de la base de données mongoDB
mongoose.connect(process.env.MONGODB_CONNECT, // Utilisation d'une variable d'environment
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajout des Middlewares d'autorisations
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();  
});



app.use (mongoSanitize()); // Middleware pour nettoyer les données
app.use(cors()); // Middleware pour autoriser les requêtes
app.use('/images', express.static(path.join(__dirname, 'images'))); // Middleware pour charger les images

app.use('/api/sauces', sauceRoutes); // Middleware pour les routes
app.use('/api/auth', userRoutes); // Middleware pour les routes

module.exports = app; // Module exporté
app.use(helmet()); // Middleware pour sécuriser les requêtes
