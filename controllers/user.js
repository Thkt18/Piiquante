const bcrypt = require('bcrypt'); // bcrypt permet de hasher le mot de passe
const User = require('../models/User'); // User permet de créer un nouvel utilisateur
const jwt = require('jsonwebtoken'); // jwt permet de créer un token d'authentification
const validator = require('email-validator'); // validator permet de valider l'email

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    const isValidateEmail = validator.validate(req.body.email);
    if (!isValidateEmail) {
      res.writeHead(400, 'Email incorrect !"}', {
        "content-type": "application/json",
      });
      res.end("Le format de l'email est incorrect.");
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const user = new User({
            email: req.body.email,
            password: hash,
          });
          user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    }
  };
  
// Connexion d'un utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // login
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Si l'utilisateur n'existe pas
            }
            bcrypt.compare(req.body.password, user.password) // On compare le mot de passe entré avec le hash enregistré
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Si le mot de passe est incorrect
                    }
                    res.status(200).json({ // Success
                        userId: user._id, // On renvoie l'id de l'utilisateur
                        token: jwt.sign( // On renvoie un token d'authentification
                            { userId: user._id },
                            process.env.KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};