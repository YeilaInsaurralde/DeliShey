// Operación manual y controlada: nunca se ejecuta en cada despliegue.
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/database/db');
(async () => {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_CURRENT_PASSWORD;
  if (!email || !password) throw new Error('Definí ADMIN_EMAIL y ADMIN_CURRENT_PASSWORD solo para esta ejecución');
  const [users] = await db.query('SELECT id, password, role_id FROM users WHERE email = ?', [email]);
  if (users.length !== 1 || !(await bcrypt.compare(password, users[0].password))) {
    throw new Error('No se pudo verificar la cuenta del administrador');
  }
  const [result] = await db.query('UPDATE users SET role_id = 1 WHERE id = ? AND role_id = 2', [users[0].id]);
  console.log(result.affectedRows ? 'Rol administrador asignado' : 'Sin cambios: el usuario ya es administrador u otro estado');
})().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(() => db.end());
