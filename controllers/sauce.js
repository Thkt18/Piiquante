const fs = require('fs'); // Module fs qui permet de créer, lire, écrire, copier, renomer ou supprimer des fichiers.
const sauce = require('../models/sauce'); // Importe le modèle sauce
const Sauce = require('../models/sauce'); // Importe le modèle sauce

// Crée une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // On récupère les données envoyées par le front-end
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On génère l'URL de l'image
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }))
};

// Afficher une seule sauce
exports.getOneSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id }) // On récupère l'id de la sauce
  .then(sauce => res.status(200).json(sauce)) // On renvoie la sauce
  .catch(error => res.status(404).json({ error })); // On récupère l'erreur
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    if(sauce.userId == req.auth.userId){ // On vérifie que l'utilisateur est bien celui qui a créé la sauce
      res.status(401).json({message:"Utilisateur non autorisé !"})
    } else{
      const sauceObject = req.file ? // On vérifie si on a une image
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On génère l'URL de l'image
        } : { ...req.body };
      if (req.file) {
        Sauce.findOne({ _id: req.params.id }) // On récupère l'id de la sauce
          .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1]; // On récupère l'adresse de l'image
            fs.unlink(`images/${filename}`, () => { 
              Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // On modifie la sauce
                .then(() => { res.status(200).json({ message: 'Sauce mise à jour!' }); })
                .catch((error) => { res.status(400).json({ error }); });
            })
          })
          .catch((error) => { res.status(500).json({ error }); });
  
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce mise à jour!' }))
          .catch((error) => res.status(400).json({ error }));
      }
    }
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id }) // on identifie la sauce
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1]; // on récupère l'adresse de l'image
          fs.unlink(`images/${filename}`, () => { // on la supprime du serveur
              sauce.deleteOne({ _id: req.params.id }) // on supprime la sauce de la bdd
              .then(() => res.status(200).json({message: 'Sauce supprimée'}))
              .catch(error => res.status(400).json({ error }));
          })
      })
};

//Afficher toutes les sauces
exports.getAllSauce = (req, res, next) => { // On récupère toutes les sauces
  sauce.find()
  .then(sauce => res.status(200).json(sauce)) // On récupère toutes les sauces
  .catch(error => res.status(400).json({ error })); // On récupère l'erreur
};

// Like et dislike
exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }) // On récupère l'id de la sauce
      .then(sauce => {
          if (req.body.like === 1) { // On récupère le like
              if (sauce.usersLiked.includes(req.body.userId)) { // On vérifie que l'utilisateur n'a pas déjà liké la sauce
                  res.status(401).json({error: 'Sauce déja liké'});
              } else {
                  Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } }) // On incrémente le like
                      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                      .catch(error => res.status(400).json({ error }))
              }
          } 
          else if (req.body.like === -1) { // On récupère le dislike
              if (sauce.usersDisliked.includes(req.body.userId)) { // On récupère l'utilisateur
                  res.status(401).json({error: 'Sauce déja disliké'});
              } else {
                  Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) // On incrémente le dislike
                      .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                      .catch(error => res.status(400).json({ error }));
              }
          } else {
              if (sauce.usersLiked.includes(req.body.userId)) { // On récupère l'utilisateur
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // On supprime le like
                      .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }));
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }) // On supprime le dislike
                          .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                          .catch(error => res.status(400).json({ error }));
              }
          }
      })
      .catch(error => res.status(400).json({ error }));   
};









