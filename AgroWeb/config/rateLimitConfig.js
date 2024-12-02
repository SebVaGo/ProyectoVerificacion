const rateLimit = require('express-rate-limit');

const rateLimitConfig = rateLimit({
    windowMs: 1 * 10 * 1000, // 10 segundos
    max: 1000, // Límite de solicitudes por ventana de tiempo
    message: "Too many requests from this IP, please try again after 15 minutes",
});

module.exports = rateLimitConfig;
