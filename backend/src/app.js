const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.router');
const contactoRoutes = require('./routes/contacto.router');
const orderRoutes = require('./routes/order.router');
const errorMiddleware = require('./middlewares/error.middleware');


const app = express();

// Cabeceras de seguridad estándar
app.use(helmet());

// Solo el frontend configurado en FRONTEND_URL puede usar la API desde el navegador
app.use(cors({
    origin: process.env.FRONTEND_URL || false
}));

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);

app.use('/api/contacto', contactoRoutes);

app.use('/api/orders', orderRoutes);

// Rutas que no existen
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Siempre al final: atrapa los errores de todas las rutas de arriba
app.use(errorMiddleware);

module.exports = app;