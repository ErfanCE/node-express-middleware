const { join } = require('node:path');
const { access, writeFile, constants } = require('node:fs/promises');

const products = require('../products-data.json');

const isValidProductId = (productId) => {
  if (productId === null) return false;
  if (isNaN(Number(productId))) return false;
  if (!Number.isInteger(Number(productId))) return false;
  if (Number(productId) < 0) return false;

  return true;
};

const getAllProducts = (_request, response) => {
  response.status(200).json({
    status: 'success',
    data: { total: products.length, products }
  });
};

const getProductbyId = (request, response) => {
  const { id: productId = null } = request.params;

  if (!isValidProductId(productId)) {
    return response.status(404).json({
      status: 'fail',
      data: { message: `Not Found` }
    });
  }

  const product = products.find((product) => product.id === Number(productId));
  if (!product) {
    return response.status(404).json({
      status: 'fail',
      data: { message: `Product(id: ${productId}) not Found` }
    });
  }

  response.status(200).json({
    status: 'success',
    data: { product }
  });
};

const addProduct = async (request, response) => {
  try {
    const {
      id: productId = null,
      title = null,
      price = null,
      rating = null,
      stock = null,
      brand = null,
      category = null
    } = request.body;

    if (!isValidProductId(productId)) {
      return response.status(400).json({
        status: 'fail',
        data: { message: `invalid product id` }
      });
    }

    // TODO: product properties validation

    const isProductExist = !!products.find(
      (product) => product.id === Number(productId)
    );
    if (isProductExist) {
      return response.status(409).json({
        status: 'fail',
        data: { message: `Product(id: ${productId}) already exists.` }
      });
    }

    // add new product
    products.push({
      id: productId,
      title,
      price,
      rating,
      stock,
      brand,
      category
    });
    const productsAsJson = JSON.stringify(products);

    await access(join(__dirname, '../products-data.json'), constants.F_OK);
    await writeFile(join(__dirname, '../products-data.json'), productsAsJson);

    response.status(200).json({
      status: 'success',
      data: {
        product: {
          id: productId,
          title,
          price,
          rating,
          stock,
          brand,
          category
        }
      }
    });
  } catch (err) {
    console.error(`[-] product-controller.js > addProduct:`, err?.message);
    console.log(err);

    return response.status(500).json({
      status: 'error',
      error: { message: 'internal server error' }
    });
  }
};

const editProductById = async (request, response) => {
  try {
    const { id: productId = null } = request.params;
    const {
      title = null,
      price = null,
      rating = null,
      stock = null,
      brand = null,
      category = null
    } = request.body;

    if (!isValidProductId(productId)) {
      return response.status(404).json({
        status: 'fail',
        data: { message: 'Not Found' }
      });
    }

    // TODO: product properties validation

    const product = products.find(
      (product) => product.id === Number(productId)
    );
    if (!product) {
      return response.status(404).json({
        status: 'fail',
        data: { message: `Product(id: ${productId}) not Found` }
      });
    }

    // edit product properties
    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.rating = rating ?? product.rating;
    product.stock = stock ?? product.stock;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;

    const productsAsJson = JSON.stringify(products);

    await access(join(__dirname, '../products-data.json'), constants.F_OK);
    await writeFile(join(__dirname, '../products-data.json'), productsAsJson);

    response.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (err) {
    console.error(`[-] product-controller.js > editProductById:`, err?.message);
    console.log(err);

    return response.status(500).json({
      status: 'error',
      error: { message: 'internal server error' }
    });
  }
};

const removeProductById = async (request, response) => {
  try {
    const { id: productId = null } = request.params;

    if (!isValidProductId(productId)) {
      return response.status(404).json({
        status: 'fail',
        data: { message: `Not Found` }
      });
    }

    const targetProductIndex = products.findIndex(
      (product) => product.id === Number(productId)
    );
    if (targetProductIndex === -1) {
      return response.status(404).json({
        status: 'fail',
        data: { message: `Product(id: ${productId}) not Found` }
      });
    }

    // remove product
    products.splice(targetProductIndex, 1);
    const productsAsJson = JSON.stringify(products);

    await access(join(__dirname, '../products-data.json'), constants.F_OK);
    await writeFile(join(__dirname, '../products-data.json'), productsAsJson);

    response.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error(
      `[-] product-controller.js > removeProductById:`,
      err?.message
    );
    console.log(err);

    return response.status(500).json({
      status: 'error',
      error: { message: 'internal server error' }
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductbyId,
  editProductById,
  removeProductById
};
