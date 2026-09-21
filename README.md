# DeliShey

Tienda online de pastelería, panadería y regalos. Los clientes se registran, arman su carrito y finalizan el pedido por WhatsApp. Un administrador gestiona los productos desde un panel propio.

## Tecnologías

- **Frontend:** Angular 21
- **Backend:** Node.js + Express 5
- **Base de datos:** MySQL / MariaDB
- **Seguridad:** autenticación con JWT, contraseñas con bcrypt, validación de datos (express-validator), límite de intentos (express-rate-limit), helmet y CORS restringido

## Estructura

```
DeliShey/
├── backend/     API (Express)
│   └── src/
│       ├── controllers/  routes/  services/  models/
│       ├── middlewares/  validators/  utils/
│       └── database/     schema.sql, seed.sql e init.js
└── frontend/    Aplicación web (Angular)
    └── src/
        ├── app/          pages, components, services, guards, interceptors
        └── environments/ URL de la API por entorno
```

## Requisitos

- Node.js 20.19+, 22.12+ o 24+ (requisito de Angular 21; se probó con Node 24)
- MySQL o MariaDB (por ejemplo, con XAMPP)
- Una cuenta de Gmail con **contraseña de aplicación** (para enviar los mails de recuperación de contraseña y de contacto)

## Puesta en marcha

### 1. Base de datos

Con MySQL corriendo, creá la base y las tablas con **una** de estas opciones:

- **Desde phpMyAdmin o Workbench:** importá `backend/src/database/schema.sql` y después `backend/src/database/seed.sql`.
- **Desde la terminal:**

```powershell
cd backend
node src/database/init.js
```

> **Ojo:** hacelo solo en una base nueva. El seed vuelve a insertar los productos y usuarios de ejemplo.

### 2. Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Abrí el archivo `.env` y completá los valores (el archivo `.env.example` explica cada variable). Después:

```powershell
npm run dev
```

El backend queda en http://localhost:3000. Para correrlo sin `nodemon` (producción) se usa `npm start`.

### 3. Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm start
```

La app queda en http://localhost:4200.

> Si cambiás `angular.json` o los archivos de `environments`, hay que reiniciar `npm start`.

## Usuario administrador

El seed crea un usuario `admin@delishey.com`, pero **sin contraseña real**: no se puede iniciar sesión con él. Para tener un administrador:

1. Registrate desde la app (`/register`).
2. Convertí tu usuario en administrador con esta consulta SQL (con tu email):

```sql
UPDATE deli_shey.users SET role_id = 1 WHERE email = 'tu_email@ejemplo.com';
```

3. Cerrá sesión y volvé a iniciarla: el rol viaja dentro del token.

Los roles son `1 = administrador` y `2 = cliente`. El panel está en `/admin`.

## Configuración

| Qué | Dónde |
|---|---|
| Variables del servidor (base, JWT, mail) | `backend/.env` |
| URL de la API | `frontend/src/environments/` |
| Número de WhatsApp y costo de envío | `frontend/src/app/config/store.config.ts` |
| Imágenes de productos | `frontend/public/assets/` (en el panel se cargan como `/assets/nombre.jpg`) |

Categorías de productos: `Pastelería`, `Panadería` y `Regalos`.

## API

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/users/register` | Público |
| POST | `/api/users/login` | Público |
| POST | `/api/users/forgot-password` | Público |
| POST | `/api/users/reset-password/:token` | Público |
| GET | `/api/products` | Público (solo productos activos) |
| GET | `/api/products/category/:category` | Público |
| GET | `/api/products/:id` | Público |
| GET | `/api/products/admin/all` | Administrador (incluye inactivos) |
| POST | `/api/products` | Administrador |
| PUT | `/api/products/:id` | Administrador |
| DELETE | `/api/products/:id` | Administrador |
| POST | `/api/contacto` | Público (envía un mail) |

## Antes de publicar

- En `frontend/src/environments/environment.ts`, reemplazar la URL de ejemplo por la del backend real.
- En el `.env` del servidor: `FRONTEND_URL` con la dirección real del frontend, una `JWT_SECRET` propia y larga, y una contraseña para la base de datos.
- Cambiar los datos de ejemplo del seed.