const productModel = require('../models/product.model');
const HttpError = require('../utils/httpError');

//logica de CRUD de productos

//productos activos (lo que ve el público)
exports.getAllProducts = async () => {

    return await productModel.findAll();

};

//todos los productos, activos e inactivos (solo admin)
exports.getAllProductsAdmin = async () => {

    return await productModel.findAllAdmin();

};

exports.getProductById = async (id) => {

    const product =
        await productModel.findById(id);

    // un producto inactivo no se le muestra al público
    if (!product || !product.is_active) {
        throw new HttpError(404, 'Producto no encontrado');
    }

    return product;

};

exports.createProduct = async (data) => {

    await productModel.create(data);

    return {
        message: 'Producto creado'
    };

};

exports.updateProduct = async (
    id,
    data
) => {

    const product =
        await productModel.findById(id);

    if (!product) {
        throw new HttpError(404, 'Producto no encontrado');
    }

    await productModel.update(
        id,
        data
    );

    return {
        message: 'Producto actualizado'
    };

};

exports.deleteProduct = async (
    id
) => {

    const result =
        await productModel.delete(id);

    if (result.affectedRows === 0) {
        throw new HttpError(404, 'Producto no encontrado');
    }

    return {
        message: 'Producto eliminado'
    };

};

//category
exports.getProductsByCategory =
async (category) => {

    return await productModel
        .findByCategory(category);

};