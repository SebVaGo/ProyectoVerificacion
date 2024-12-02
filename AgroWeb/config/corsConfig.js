const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    // Agrega otros orígenes locales si es necesario
];

const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.NODE_ENV === 'production') {
            // Permitir todos los orígenes en producción
            callback(null, true);
        } else {
            // Solo permitir orígenes específicos en desarrollo
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
};

module.exports = corsOptions;
