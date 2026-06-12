
-- =========================
-- SEED ROLES
-- =========================

INSERT IGNORE INTO roles(name)
VALUES
('admin'),
('client');

-- =========================
-- SEED ADMIN
-- =========================
-- IMPORTANTE:
-- La password debería estar hasheada con bcrypt desde el backend.
-- Esta es solo de ejemplo.
-- Si tu login usa bcrypt, NO pongas texto plano.

INSERT INTO users
(id, name, email, password, role_id)
VALUES
(
    1,
    'Admin',
    'admin@delishey.com',
    '$2b$10$EjemploHashDePasswordCambiarPorUnoReal',
    1
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    email = VALUES(email),
    password = VALUES(password),
    role_id = VALUES(role_id);

-- =========================
-- SEED PRODUCTS
-- =========================

INSERT INTO products
(id, name, price, category, description, image, is_active)
VALUES
(
    1,
    'Torta',
    15000.00,
    'Pastelería',
    'Torta artesanal',
    '/assets/tortaChocolate.jpg',
    TRUE
),
(
    2,
    'Cheesecake',
    17000.00,
    'Pastelería',
    'Cheesecake con frutos rojos',
    '/assets/chesscake.jpg',
    TRUE
),
(
    3,
    'Medialunas',
    1200.00,
    'Panadería',
    'Medialuna de manteca',
    '/assets/croasant.jpg',
    TRUE
),
(
    4,
    'Pan casero',
    2000.00,
    'Panadería',
    'Pan casero',
    '/assets/panes.jpg',
    TRUE
),
(
    5,
    'Pastel de Fresas',
    25.00,
    'Pastelería',
    'Delicioso pastel con fresas frescas y crema.',
    '/assets/tortaFresa.jpg',
    TRUE
),
(
    6,
    'Cupcake de Vainilla',
    3.50,
    'Pastelería',
    'Suave cupcake con frosting de vainilla.',
    '/assets/cupcakesVainilla.jpg',
    TRUE
),
(
    7,
    'Tarta de Chocolate',
    30.00,
    'Pastelería',
    'Intenso sabor a chocolate belga.',
    '/assets/tortaChoc.jpg',
    TRUE
),
(
    8,
    'Pan Artesanal',
    5.00,
    'Panadería',
    'Pan recién horneado con masa madre.',
    '/assets/panArtesanal.jpg',
    TRUE
),
(
    9,
    'Croissant',
    2.50,
    'Panadería',
    'Mantequilla pura y capas crujientes.',
    '/assets/croasant.jpg',
    TRUE
),
(
    10,
    'Baguette',
    1.80,
    'Panadería',
    'Tradicional baguette francesa.',
    '/assets/baguetes.jpg',
    TRUE
),
(
    11,
    'Caja de Macarons',
    15.00,
    'Regalos',
    '12 macarons surtidos en caja de regalo.',
    '/assets/macarrons.jpg',
    TRUE
),
(
    12,
    'Canasta de Desayuno',
    45.00,
    'Regalos',
    'Completa canasta con panes y dulces.',
    '/assets/boxdesayuno.jpg',
    TRUE
),
(
    13,
    'Set de Galletas Decoradas',
    12.00,
    'Regalos',
    'Galletas temáticas hechas a mano.',
    '/assets/galletadecorada.jpg',
    TRUE
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    price = VALUES(price),
    category = VALUES(category),
    description = VALUES(description),
    image = VALUES(image),
    is_active = VALUES(is_active);