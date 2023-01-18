// Import d'express
const express = require('express');

// Utilisation d'express
const app = express();

// Accès au core de la requête
app.use(express.json());

// Import de MongoDB
const mongoose = require('mongoose');

const Sauce = require('./models/sauce');

const path = require('path');

// Import des routes
const sauceRoutes = require('./routes/sauce');

// Import des routes
const userRoutes = require('./routes/user');

const cors = require('cors');

// Configuration de la base de données mongoDB
mongoose.connect('mongodb+srv://admin:admin@clusterpiiquante.50ks1cn.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  
  app.use('/images', express.static(path.join(__dirname, 'images')));

// Ajout des Middlewares d'autorisations
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();  
});

app.post('/api/stuff', (req, res, next) => {
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

app.use(cors());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
