const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Register/Usuario')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(400).json({ error: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        req.userId = decoded.id;  // Guardamos el ID del usuario en la solicitud (req)
        next(); // Pasamos al siguiente middleware o controlador
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o ha expirado.' });
    }
};

module.exports = authenticateJWT;
