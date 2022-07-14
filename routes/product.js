const productController = require('../seeders/productController')
const express = require('express')
const ROUTER = express.Router()

ROUTER.get('/', productController.getProducts)
ROUTER.get('/item/:id_product', productController.getProductsByID)
ROUTER.post('/insert', productController.insertProduct)
ROUTER.put('/edit/:id_product', productController.editProduct)
ROUTER.delete('/delete/:id_product', productController.deleteProduct)

module.exports = ROUTER