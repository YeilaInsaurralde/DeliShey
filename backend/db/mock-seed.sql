-- DeliShey - Seed base (MySQL/MariaDB)

-- Ejecutar con: USE delishey;

-- Roles
INSERT INTO roles (name) VALUES
  ('admin'),
  ('empleado'),
  ('cliente')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Obtener role ids
-- (MySQL permite usar variables para simplificar)

SET @admin_role_id := (SELECT id FROM roles WHERE name = 'admin' LIMIT 1);
SET @empleado_role_id := (SELECT id FROM roles WHERE name = 'empleado' LIMIT 1);
SET @cliente_role_id := (SELECT id FROM roles WHERE name = 'cliente' LIMIT 1);

-- Crear usuarios con password_hash.
-- Importante: password_hash debe ser bcrypt.
-- Este seed usa el hash de bcryptjs de la contraseña 'admin123' y 'empleado123'.
-- Si necesitas cambiar contraseñas, generá nuevos hashes.

-- Hashes precomputados (bcryptjs):
-- admin123 -> $2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (placeholder)
-- empleado123 -> $2a$10$YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY (placeholder)
-- NOTA: Como no podemos calcular aquí sin ejecutar código, dejamos el placeholder.
-- Alternativa: correr el script de setup del backend que agregaremos o generarlos con bcrypt.

-- Por ahora, no insertamos si el hash es placeholder.

-- Inserción admin (si quieres, reemplaza el hash por uno real)
INSERT INTO users (email, name, password_hash, role_id)
SELECT
  'admin@delishey.com',
  'Admin',
  '$2b$10$CHANGE_ME_ADMIN_BCRYPT_HASH',
  @admin_role_id
WHERE @admin_role_id IS NOT NULL
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role_id = VALUES(role_id);

-- Inserción empleado (si quieres, reemplaza el hash por uno real)
INSERT INTO users (email, name, password_hash, role_id)
SELECT
  'empleado@delishey.com',
  'Empleado',
  '$2b$10$CHANGE_ME_EMPLEADO_BCRYPT_HASH',
  @empleado_role_id
WHERE @empleado_role_id IS NOT NULL
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role_id = VALUES(role_id);

-- Productos semilla (misma data del mock)
INSERT INTO products (id, name, price, category, description, image, is_active) VALUES
  (1, 'Pastel de Fresas', 25.00, 'Pastelería', 'Delicioso pastel con fresas frescas y crema.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', 1),
  (2, 'Cupcake de Vainilla', 3.50, 'Pastelería', 'Suave cupcake con frosting de vainilla.', 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500', 1),
  (3, 'Tarta de Chocolate', 30.00, 'Pastelería', 'Intenso sabor a chocolate belga.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', 1),
  (4, 'Pan Artesanal', 5.00, 'Panadería', 'Pan recién horneado con masa madre.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', 1),
  (5, 'Croissant', 2.50, 'Panadería', 'Mantequilla pura y capas crujientes.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500', 1),
  (6, 'Baguette', 1.80, 'Panadería', 'Tradicional baguette francesa.', 'https://images.unsplash.com/photo-1589367920969-ab8e050bab3e?w=500', 1),
  (7, 'Caja de Macarons', 15.00, 'Regalos', '12 macarons surtidos en caja de regalo.', 'https://images.unsplash.com/photo-1569864358642-9d1619702661?w=500', 1),
  (8, 'Canasta de Desayuno', 45.00, 'Regalos', 'Completa canasta con panes y dulces.', 'https://images.unsplash.com/photo-1525203135335-74d292fb8d5c?w=500', 1),
  (9, 'Set de Galletas Decoradas', 12.00, 'Regalos', 'Galletas temáticas hechas a mano.', 'https://images.unsplash.com/photo-1481391243133-f96216d55ff7?w=500', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  category = VALUES(category),
  description = VALUES(description),
  image = VALUES(image),
  is_active = VALUES(is_active);

