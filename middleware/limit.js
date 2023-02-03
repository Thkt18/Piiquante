const Limit = require("express-rate-limit");

const apiLimit = Limit ({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limite chaque IP à 3 requêtes par fenêtre
    message: "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes"
});

module.exports = {apiLimit};