// Mongoose module de gestion de la base de données MongoDB
const mongoose = require('mongoose'); 
// Mongoose-unique-validator permet de vérifier que les données sont uniques
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Exportation du modèle de données pour les utilisateurs
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);