const express = require('express');
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductbyId,
  editProductById,
  removeProductById
} = require('../controllers/product-controller');

//* /product
router.get('/get-all-products', getAllProducts);
router.post('/create-product', addProduct);

router.get('/get-product/:id', getProductbyId);
router.patch('/update-product/:id', editProductById);
router.delete('/remove-product/:id', removeProductById);

module.exports = router;
