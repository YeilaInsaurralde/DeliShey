const productModel = require('../models/product.model');

//logica de CRUD de productos

exports.getAllProducts = async () => {

    return await productModel.findAll();

};

exports.getProductById = async (id) => {

    const product =
        await productModel.findById(id);

    if (!product) {

        throw new Error(
            'Producto no encontrado'
        );

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

    await productModel.delete(id);

    return {
        message: 'Producto eliminado'
    };

};