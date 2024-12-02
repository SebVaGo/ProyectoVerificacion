const helmet = require('helmet');

// Configuración de Helmet
const helmetConfig = [
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    }),
    helmet.hidePoweredBy(),  // Ocultar la cabecera X-Powered-By
    helmet.referrerPolicy({ policy: 'no-referrer' }),  // Política de referenciador
    // Aquí puedes agregar más middlewares de Helmet según sea necesario
];

module.exports = helmetConfig;
