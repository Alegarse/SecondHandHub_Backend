const express = require('express');
const {
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
} = require('../controllers/productController');
const { verifyValidToken, verifyOwner } = require('../core/middlewares/auth');

const router = express.Router();

//Endpoints authenticated for products
router.post('/', verifyValidToken, addProduct);
router.get('/', verifyValidToken, getAllProducts);
router.get('/:idProduct', verifyValidToken, getProductById);
router.patch('/update/:idProduct', verifyValidToken, verifyOwner, updateProductById);
router.delete('/delete/:idProduct', verifyValidToken, verifyOwner, deleteProductById);

// Exports the router
module.exports = router;
