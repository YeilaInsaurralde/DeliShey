const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.router');
const contactoRoutes = require('./routes/contacto.router');
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

app.use(errorMiddleware);


app.use('/api/contacto', contactoRoutes);

module.exports = app;