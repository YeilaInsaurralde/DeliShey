# MySQL/MariaDB - ABM con roles

## 1) Crear base de datos
Crea una base de datos (ejemplo):
```sql
CREATE DATABASE delishey CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE delishey;
```

## 2) Ejecutar schema
```sql
SOURCE ./schema.sql;
```

## 3) Ejecutar seed
```sql
SOURCE ./seed.sql;
```

> Nota: `seed.sql` deja placeholders en `password_hash` para que no insertés hashes inválidos. 
> Luego vamos a agregar un endpoint/script para crear usuarios con bcrypt desde el backend.

