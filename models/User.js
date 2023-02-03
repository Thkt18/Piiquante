// Mongoose module de gestion de la base de données MongoDB
const mongoose = require('mongoose'); 
// Mongoose-unique-validator permet de vérifier que les données sont uniques
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

// Création du schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true }, // Email unique grâce à unique-validator
  password: { type: String, required: true }
});

// Exportation du modèle de données pour les utilisateurs
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);