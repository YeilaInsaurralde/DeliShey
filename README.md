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
- Una cuenta de **Brevo** con clave de API para los correos transaccionales.
- Una cuenta de **ImgBB** con clave de API para cargar las fotografías de productos desde el panel.

## Puesta en marcha

### 1. Base de datos

Con MySQL corriendo, creá la base y las tablas con **una** de estas opciones:

- **Desde phpMyAdmin o Workbench:** importá `backend/src/database/schema.sql` y después `backend/src/database/seed.sql`.
- **Desde la terminal:**

```powershell
cd backend
node src/database/init.js
```

> **Ojo:** hacelo solo en una base nueva. El seed vuelve a insertar los productos de ejemplo.

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

Los roles son `1 = admin` y `2 = client`; el panel de administración está en `/admin`. El registro público crea cuentas de cliente, no de administrador.

### Primera instalación en una base nueva

1. Inicializá la base con las tablas `roles` y `users` y verificá que exista el rol `admin` con `id = 1`.
2. Configurá **temporalmente** en `backend/.env` (local) o en las variables privadas del entorno de ejecución:

```env
ADMIN_BOOTSTRAP_NAME=Administrador
ADMIN_BOOTSTRAP_EMAIL=admin@ejemplo.com
ADMIN_BOOTSTRAP_PASSWORD=REEMPLAZAR_POR_UNA_CONTRASENA_SEGURA
```

3. Desde `backend/`, ejecutá **una sola vez**:

```bash
npm run admin:bootstrap
```

4. Comprobá que el administrador pueda iniciar sesión. Después **eliminá las variables `ADMIN_BOOTSTRAP_*`** del entorno.

El comando crea el primer administrador solamente cuando **no existe ninguno**, comprueba que el correo no esté ocupado y genera un hash con `bcrypt`. Requiere una contraseña de al menos 12 caracteres y hasta 72 bytes. Si ya existe un administrador, se detiene sin modificar cuentas. No se ejecuta automáticamente en `npm start`, `db:init` ni en cada despliegue.

**No incluyas credenciales reales en el README, `.env.example` ni GitHub.** En Railway, configurá las variables de forma temporal y ejecutá el script solamente mediante un procedimiento administrativo autorizado. No es una ruta pública de la API.

### Promoción manual de una cuenta existente

El comando `npm run admin:promote` es una operación separada y excepcional: verifica las credenciales de una cuenta existente y cambia su rol de cliente a administrador. Ejecutalo solo por personal autorizado con acceso al servidor y la base de datos; conocer la contraseña de un cliente por sí solo **no** autoriza a otorgarle privilegios administrativos.

**En despliegues posteriores no se vuelve a crear ni a promocionar al administrador.** Las cuentas que ya existen en la base se conservan.

## Configuración

| Qué | Dónde |
|---|---|
| Variables del servidor (base, JWT, Brevo, ImgBB) | `backend/.env` en local; variables privadas del servicio en Railway |
| URL de la API | `frontend/src/environments/` |
| Número de WhatsApp y costo de envío | `frontend/src/app/config/store.config.ts` |
| Imágenes de productos | Se suben a ImgBB desde el panel administrativo; MySQL guarda la URL pública |

Categorías de productos: `Pastelería`, `Panadería` y `Regalos`.

### Servicios externos: ImgBB y Brevo

- **ImgBB:** configurá `IMGBB_API_KEY` solamente en el backend (archivo `.env` local o variable privada del servicio backend en Railway). El panel permite seleccionar una imagen; el backend la carga a ImgBB y almacena la URL resultante en MySQL. No expongas la clave en Angular ni la subas al repositorio.
- **Brevo:** configurá `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` y `BREVO_SENDER_NAME` en el backend para los correos transaccionales. El remitente debe estar autorizado/verificado en Brevo.
- En **Railway**, seleccioná el **servicio del backend** y cargá las variables desde la pestaña **Variables** antes de hacer `git push`, ya que el despliegue puede iniciarse automáticamente.
- En **Vercel** se despliega el frontend; no coloques allí las claves privadas de ImgBB o Brevo.

> Importante: los archivos de inicialización SQL están preparados para `deli_shey` y pueden contener instrucciones `USE deli_shey`. Revisalos antes de ejecutarlos contra una base con otro nombre o con datos existentes.

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
- En las variables privadas del backend: `FRONTEND_URL` con la dirección real del frontend, una `JWT_SECRET` propia y larga, credenciales de base y las claves `IMGBB_API_KEY` / `BREVO_API_KEY`.
- Cambiar los datos de ejemplo del seed.