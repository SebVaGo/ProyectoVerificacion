require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Asegúrate de que el módulo cors esté importado
const { sequelize } = require('./config/database'); // Importa la configuración de la base de datos
const path = require('path'); // Importar 'path' para servir archivos estáticos


// Importar configuraciones modulares
const corsOptions = require('./config/corsConfig');
const helmetConfig = require('./config/helmetConfig');
const rateLimitConfig = require('./config/rateLimitConfig');

// Importar rutas
const authRoutes = require('./services/routes/authRoutes');
const obtenerDatosRoutes = require('./services/routes/obtenerDatosRoutes');
const tipoUsuarioRoutes = require('./services/routes/tipoUsuarioRouter');
const recoveryRoutes = require('./services/routes/recoveryRoutes');
const sellerRoutes = require('./services/routes/sellerRoutes');
const addCategory = require('./services/routes/addCategory');
const addItems = require('./services/routes/addItems');
const crudProduct = require('./services/routes/crudProduct');
const medidaRoutes = require('./services/routes/medidaRoutes');
const ProductList = require('./services/routes/MainPage/ProductList');
const ProductDescription = require('./services/routes/MainPage/ProductDescriptionRoute');
const AveragePrice = require('./services/routes/MainPage/AveragePriceRoute');

const app = express();
const PORT = process.env.PORT || 5000; // 

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use(cors(corsOptions));
app.use(helmetConfig);
app.use(rateLimitConfig);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/datos', obtenerDatosRoutes);
app.use('/api/tipo-usuario', tipoUsuarioRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/add-category', addCategory);
app.use('/api/add-item', addItems);
app.use('/api/crud-product', crudProduct);
app.use('/api/medida', medidaRoutes);
app.use('/api/product-list', ProductList);
app.use('/api/product-description', ProductDescription);
app.use('/api/average-price', AveragePrice);

app.get('/test', (req, res) => {
    res.send('El servidor está funcionando correctamente');
});

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`); 
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app; 
