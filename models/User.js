// Mongoose module de gestion de la base de données MongoDB
const mongoose = require('mongoose'); 
// Mongoose-unique-validator permet de vérifier que les données sont uniques
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email'); // Mongoose-type-email permet de vérifier que l'email est valide
const validatorPackage = require('validator'); // Validator permet de vérifier que l'email est valide

// Création du schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
  email: 
  { type: mongoose.SchemaTypes.Email,
    
    validate:{
    validator: validatorPackage.isEmail,
    message: 'Email incorrect !'
  }, 
  required: true,
  unique: true }, // Email unique grâce à unique-validator
  password: { type: String, required: true }
});

// Exportation du modèle de données pour les utilisateurs
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);