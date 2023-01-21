const fs = require('fs'); // Module fs qui permet de créer, lire, écrire, copier, renomer ou supprimer des fichiers.
const sauce = require('../models/sauce'); // Importe le modèle sauce
const Sauce = require('../models/sauce'); // Importe le modèle sauce

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

// Like et dislike
exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          if (req.body.like === 1) {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  res.status(401).json({error: 'Sauce déja liké'});
              } else {
                  Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                      .catch(error => res.status(400).json({ error }))
              }
          } 
          else if (req.body.like === -1) {
              if (sauce.usersDisliked.includes(req.body.userId)) {
                  res.status(401).json({error: 'Sauce déja disliké'});
              } else {
                  Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                      .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                      .catch(error => res.status(400).json({ error }));
              }
          } else {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }));
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                          .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                          .catch(error => res.status(400).json({ error }));
              }
          }
      })
      .catch(error => res.status(400).json({ error }));   
};