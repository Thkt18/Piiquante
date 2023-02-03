const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const Sauce = require('./models/sauce');
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

  
app.use('/images', express.static(path.join(__dirname, 'images'))); // Middleware pour charger les images

// Ajout des Middlewares d'autorisations
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();  
});


app.post('/api/sauce', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});


app.get('/api/sauce/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
});


app.get('/api/sauces', (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
});
app.use (mongoSanitize()); // Middleware pour nettoyer les données
app.use(cors()); // Middleware pour autoriser les requêtes
app.use('/api/sauces', sauceRoutes); // Middleware pour les routes
app.use('/api/auth', userRoutes); // Middleware pour les routes
app.use(helmet()); // Middleware pour sécuriser les requêtes

module.exports = app; // Module exporté
