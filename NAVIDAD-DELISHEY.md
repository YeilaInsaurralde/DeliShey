# Especiales · Navidad en DeliShey

## Qué cambia

- En la barra principal aparece **Especiales**, que abre `/especiales`.
- Solo esa página tiene estética navideña. Las otras secciones no cambian.
- El botón **Ver toda la colección navideña** abre la ruta `/especiales/coleccion`.
- Las seis fotografías de muestra son originales y están en `frontend/public/assets/navidad/`.
- Los nombres e imágenes de la primera sección son ideas de catálogo: **no se venden automáticamente**.
- La colección inferior reúne **productos reales de todas las categorías** si su nombre indica Navidad, pan dulce, panettone, jengibre, rosca, trufas o torta glaseada, y también todos los que tienen categoría `Navidad`. Los precios y las imágenes provienen de MySQL/ImgBB. El carrito reutiliza `CartService`.

## Cargar los productos de Navidad

1. Aplicar el parche y comprobar Angular localmente (`cd frontend`, `npm run build`, `npm start`).
2. Actualizar también el backend local con la nueva categoría `Navidad` incluida en `product.validators.js`.
3. En Admin → Nuevo producto → Categoría `Navidad`, cargar nombre, precio y fotografía, desde las seis imágenes del directorio indicado o tus propias imágenes. El sistema las sube a ImgBB.
4. Solo los productos activos aparecen en `/especiales`.
5. **Producción Hostinger**: el backend se despliega desde `valeBor/delishey-backend-hostinger`, una copia separada. La modificación a `backend/src/validators/product.validators.js` debe trasladarse a esa copia y desplegarse ANTES de crear productos con categoría Navidad en producción. Subir solo al repositorio original no actualiza necesariamente la copia de Hostinger.
6. El frontend se despliega en Vercel desde el repositorio original `YeilaInsaurralde/DeliShey`. Probar localmente antes de hacer push.

## Importante

- No incluye inserciones SQL ni precios ficticios.
- No modifica las tablas de MySQL; la categoría es un campo de texto validado por Express.
- No incluye claves ni variables de entorno.

## Navegación y diseño actualizado

- Menú hamburguesa visible en escritorio y móvil; dentro están Inicio, categorías, Especiales, Contacto y accesos según el rol. El carrito y acceso de sesión permanecen en la barra superior.
- Las tarjetas ilustrativas de `/especiales` abren su categoría correspondiente, no un producto ficticio.
- «Ver toda la colección navideña» abre la página independiente `/especiales/coleccion`, donde se listan los productos reales, combinando varias categorías.
- Para que un producto de Pastelería, Panadería o Regalos figure automáticamente en esa colección, su nombre debe contener palabras navideñas reconocibles (p. ej. «Pan dulce», «Rosca navideña», «Caja navideña»); alternativamente, cargarlo en categoría `Navidad`. Esto es una regla temporal de presentación, no una etiqueta de base de datos.
- La decoración fotográfica de regalos, luces y ramas se guarda en `frontend/public/assets/navidad/marco-festivo.webp`, y solo se aplica a `/especiales`.
