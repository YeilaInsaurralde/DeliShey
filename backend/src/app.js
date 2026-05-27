const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
//const productRoutes = require('./routes/product.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
//app.use('/api/products', productRoutes);

app.use(errorMiddleware);

module.exports = app;