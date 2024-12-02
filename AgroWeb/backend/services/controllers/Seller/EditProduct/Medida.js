const Medida = require('../../../models/Seller/Medida');

// Mostrar las medidas 
exports.getMedidas = async (req, res) => {
    try {
        const medidas = await Medida.findAll();
        res.status(200).json({ medidas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// obtener una medida por ID
exports.getMedida = async (req, res) => {
    const { id_medida } = req.params;
    try {
        const medida = await Medida.findByPk(id_medida);
        res.status(200).json({ medida });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



