const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                // Token inválido o expirado
                console.log('AccessToken inválido o ha expirado.');
                res.clearCookie('accessToken'); // Limpiar la cookie si el token ha expirado
                return res.status(403).json({ error: 'Token inválido o ha expirado. Sesión cerrada automáticamente.' });
            }

            req.user = user; // Guardar la información del usuario extraída del token
            console.log("Usuario autenticado:", req.user); // Para debug, verificar el usuario autenticado
            next(); // Continuar con el siguiente middleware o controlador
        });
    } else {
        return res.status(401).json({ error: 'Token de acceso requerido.' });
    }
};

module.exports = authenticateJWT;
