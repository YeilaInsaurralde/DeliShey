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