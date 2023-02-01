const jwt = require('jsonwebtoken'); // Jwt permet de créer un token d'authentification
 
// Middleware d'authentification
module.exports = (req, res, next) => { // On exporte le middleware
   try {
       const token = req.headers.authorization.split(' ')[1]; // On récupère le token
       const decodedToken = jwt.verify(token, process.env.KEY); // On décode le token
       const userId = decodedToken.userId; // On récupère le userId
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};