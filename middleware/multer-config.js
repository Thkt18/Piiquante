const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Logique néccessaire  à multer pour indiquer où enregistrer les fichiers entrants et comment les nommer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Indication à multer où enregistrer les fichiers
  },
  /* Indication à multer de nommer les fichiers de manière unique en utisant
    le nom d'origine, de remplacer les espaces par des underscores et d'ajouter
    un timestamp Date.now() comme nom de fichier. */
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* On exporte ensuite l'élément Multer, lui passons la constance storage et lui indique que nous
    gérerons uniquement les téléchargements de fichiers image */
module.exports = multer({storage: storage}).single('image');