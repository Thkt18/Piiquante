const fs = require('fs'); // Module fs qui permet de créer, lire, écrire, coper, renomer ou supprimer des fichiers.
const sauce = require('../models/sauce');
const Sauce = require('../models/sauce');

// Crée une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }))
};

// Afficher une seule sauce
exports.getOneSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({message: 'Sauce modifiée'}))
      .catch(error => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({message: 'Sauce supprimée'}))
              .catch(error => res.status(400).json({ error }));
          })
      })
};

//Afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  sauce.find()
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }));
};