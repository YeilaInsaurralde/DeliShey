const productService = require('../services/product.service');

//funciones asincronicas

//respuesta todos los productos...para listar
exports.index = async (req, res, next) => {
    try {
        const products =
            await productService.getAllProducts();
        res.json(products);

    } catch (error) {
        next(error);
    }
};

//todos los productos, activos e inactivos (solo admin)
exports.indexAdmin = async (req, res, next) => {
    try {
        const products =
            await productService.getAllProductsAdmin();
        res.json(products);

    } catch (error) {
        next(error);
    }
};

//muestra producto segun el id
exports.show = async (req, res, next) => {
    try {
        const product =
            await productService.getProductById(req.params.id);

        res.json(product);

    } catch (error) {
        next(error);
    }
};

//guardar producto
exports.store = async (req, res, next) => {

    try {
        const result =
            await productService.createProduct(
                req.body
            );
        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};

//modificar producto
exports.update = async (req, res, next) => {
    try {
        const result =
            await productService.updateProduct(
                req.params.id,
                req.body
            );
        res.json(result);

    } catch (error) {
        next(error);
    }
};

//eliminar producto
exports.destroy = async (req, res, next) => {

    try {
        const result =
            await productService.deleteProduct(
                req.params.id
            );

        res.json(result);

    } catch (error) {
        next(error);
    }
};

//category
exports.productsByCategory =
async (req, res, next) => {

    try {

        const products =
            await productService
                .getProductsByCategory(
                    req.params.category
                );

        res.json(products);

    } catch (error) {

        next(error);

    }

};
// Imagen pública de producto, subida exclusivamente por un administrador.
exports.uploadImage = async (req, res, next) => {
    try {
        const buffer = req.body;
        const mime = req.headers['content-type']?.split(';')[0]?.trim();
        if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ message: 'Seleccioná una imagen de hasta 5 MB' });
        }
        const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        const png = buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
        const webp = buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
        if (!((mime === 'image/jpeg' && jpg) || (mime === 'image/png' && png) || (mime === 'image/webp' && webp))) {
            return res.status(400).json({ message: 'Formato inválido: JPG, PNG o WebP' });
        }
        if (!process.env.IMGBB_API_KEY) {
            return res.status(503).json({ message: 'La carga de imágenes todavía no está configurada' });
        }
        const form = new FormData();
        form.append('image', new Blob([buffer], { type: mime }), 'producto');
        const response = await fetch('https://api.imgbb.com/1/upload?key=' + encodeURIComponent(process.env.IMGBB_API_KEY), {
            method: 'POST', body: form, signal: AbortSignal.timeout(20000)
        });
        const result = await response.json();
        if (!response.ok || !result.success || !result.data?.url) {
            console.error('ImgBB no aceptó la imagen:', response.status);
            return res.status(502).json({ message: 'No se pudo almacenar la imagen' });
        }
        return res.json({ url: result.data.url });
    } catch (err) {
        if (err.name === 'TimeoutError') return res.status(504).json({ message: 'La carga tardó demasiado. Intentá de nuevo' });
        next(err);
    }
};
