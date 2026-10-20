// Alta excepcional del primer administrador. No se invoca desde npm start ni db:init.
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/database/db');

const LOCK_NAME = 'delishey:first-admin-bootstrap';

async function bootstrapAdmin() {
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim() || 'Administrador';
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
    throw new Error('Definí un ADMIN_BOOTSTRAP_EMAIL válido (máximo 100 caracteres)');
  }
  if (!name || name.length > 100) {
    throw new Error('ADMIN_BOOTSTRAP_NAME debe tener entre 1 y 100 caracteres');
  }
  if (!password || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('ADMIN_BOOTSTRAP_PASSWORD debe tener al menos 12 caracteres y hasta 72 bytes');
  }

  let connection;
  let lockAcquired = false;
  let transactionStarted = false;
  try {
    connection = await db.getConnection();
    const [[lock]] = await connection.query('SELECT GET_LOCK(?, 10) AS acquired', [LOCK_NAME]);
    if (lock.acquired !== 1) throw new Error('No se pudo obtener el bloqueo para crear el administrador');
    lockAcquired = true;

    await connection.beginTransaction();
    transactionStarted = true;

    // Validar el esquema real: esta aplicación identifica admin por role_id = 1.
    const [roles] = await connection.query('SELECT id, name FROM roles WHERE id = 1');
    if (roles.length !== 1 || roles[0].name !== 'admin') {
      throw new Error('El rol admin (id 1) no existe; inicializá correctamente los roles antes');
    }

    const [[count]] = await connection.query('SELECT COUNT(*) AS total FROM users WHERE role_id = 1');
    if (Number(count.total) > 0) {
      throw new Error('Ya existe un administrador. No se creó ni modificó ninguna cuenta');
    }

    const [existing] = await connection.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) {
      throw new Error('El correo ya pertenece a otra cuenta. No se modificó su rol');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await connection.query(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, 1)',
      [name, email, hashedPassword]
    );
    await connection.commit();
    transactionStarted = false;
    console.log('Primer administrador creado correctamente. Retirá las variables ADMIN_BOOTSTRAP_* del entorno.');
  } catch (error) {
    if (transactionStarted) await connection.rollback();
    throw error;
  } finally {
    if (connection) {
      if (lockAcquired) await connection.query('SELECT RELEASE_LOCK(?)', [LOCK_NAME]);
      connection.release();
    }
  }
}

bootstrapAdmin()
  .catch(error => { console.error('No se creó el administrador:', error.message); process.exitCode = 1; })
  .finally(() => db.end());
