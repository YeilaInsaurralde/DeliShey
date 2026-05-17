const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'deli-shey-secret-key';

app.use(cors());
app.use(bodyParser.json());

const products = [
  { id: 1, name: 'Pastel de Fresas', price: 25.00, category: 'Pastelería', description: 'Delicioso pastel con fresas frescas y crema.', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500' },
  { id: 2, name: 'Cupcake de Vainilla', price: 3.50, category: 'Pastelería', description: 'Suave cupcake con frosting de vainilla.', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500' },
  { id: 3, name: 'Tarta de Chocolate', price: 30.00, category: 'Pastelería', description: 'Intenso sabor a chocolate belga.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500' },
  { id: 4, name: 'Pan Artesanal', price: 5.00, category: 'Panadería', description: 'Pan recién horneado con masa madre.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
  { id: 5, name: 'Croissant', price: 2.50, category: 'Panadería', description: 'Mantequilla pura y capas crujientes.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500' },
  { id: 6, name: 'Baguette', price: 1.80, category: 'Panadería', description: 'Tradicional baguette francesa.', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bab3e?w=500' },
  { id: 7, name: 'Caja de Macarons', price: 15.00, category: 'Regalos', description: '12 macarons surtidos en caja de regalo.', image: 'https://images.unsplash.com/photo-1569864358642-9d1619702661?w=500' },
  { id: 8, name: 'Canasta de Desayuno', price: 45.00, category: 'Regalos', description: 'Completa canasta con panes y dulces.', image: 'https://images.unsplash.com/photo-1525203135335-74d292fb8d5c?w=500' },
  { id: 9, name: 'Set de Galletas Decoradas', price: 12.00, category: 'Regalos', description: 'Galletas temáticas hechas a mano.', image: 'https://images.unsplash.com/photo-1481391243133-f96216d55ff7?w=500' }
];

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Mock authentication
  if (email && password) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { email, name: email.split('@')[0] } });
  } else {
    res.status(400).json({ message: 'Email and password required' });
  }
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
