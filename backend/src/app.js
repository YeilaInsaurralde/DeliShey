const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.router');
const contactoRoutes = require('./routes/contacto.router');
const errorMiddleware = require('./middlewares/error.middleware');


const app = express();

app.use(cors());//medida de seguridad que permite acceso a mi api

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);

app.use(errorMiddleware);


app.use('/api/contacto', contactoRoutes);

module.exports = app;