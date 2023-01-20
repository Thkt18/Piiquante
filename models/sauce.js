const mongoose = require('mongoose'); // Mongoose module de gestion de la base de données MongoDB

// Création du schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    usersLiked: {type: Array, default: []},
    usersDisliked: {type: Array, default: []},

});

// Exportation du modèle de données pour les sauces
module.exports = mongoose.model('sauce', sauceSchema);