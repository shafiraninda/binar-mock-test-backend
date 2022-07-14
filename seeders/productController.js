const Product = require('../models').product
const {successWithData, getPagination , getPagingData} = require('../helper/helper')
const errorHandler = require('../helper/errorHandler')

// CREATE NEW PRODUCT
async function insertProduct(req, res, next){
    try {
        const {name, price, imageurl} = req.body
        if (!name) throw new errorHandler(400, 'Please insert product name!')
        if(!price) throw new errorHandler(400, 'Please insert product price!')
        if(!imageurl) throw new errorHandler(400, 'Please insert product image url!')
        const newItem = await Product.create({
            name: name,
            price: price,
            imageurl: imageurl,
            user_id: req.user.user_id
        })
        if(!newItem) throw new errorHandler(400, 'Failed to insert new product!')
        res.status(200).json(successWithData('SUCCESS', newItem))
    } catch (error) {
        throw new errorHandler(500, `Internal Server Error: ${error}`)
    }
}

// EDIT PRODUCT
async function editProduct(req,res, next){
    try {
        const {id_product} = req.params
        const {name, price, imageurl} =req.body
        if(!id_product) throw new errorHandler(400, 'Bad Request: Please insert ID product')
        const findProduct = await Product.findByPk(id_product)
        if(!findProduct) throw new errorHandler(404, 'Product not found!')
        const editData = {}
        if(name){
            editData.name= name
        }
        if(price){
            editData.price=price
        }
        if(imageurl){
            editData.imageurl=imageurl
        }
        const edited = await findProduct.update(editData)
        if(!edited) throw new errorHandler(400, 'Failed to edit product!')
        res.status(200).json(successWithData('SUCCESS', edited))
    } catch (error) {
        throw new errorHandler(500, `Internal Server Error: ${error}`)
    }
}

// DELETE DATA BY ID
async function deleteProduct(req, res, next){
    try {
        const {id_product} = req.params
        if(!id_product) throw new errorHandler(400, 'Bad Request: Please insert ID product')
        const findProduct = await Product.findByPk(id_product)
        if(!findProduct) throw new errorHandler(404, 'Product not found!')
        const deleted = await findProduct.destroy()
        if(!deleted) throw new errorHandler(400, 'Failed to delete product')
        res.status(200).json('SUCCESS')
    } catch (error) {
        throw new errorHandler(500, `Internal Server Error: ${error}`)
    }
}

// GET PRODUCTS LIST
async function getProducts(req,res, next){
    try {
        const {pageNumber, pageSize} = req.params
        const {limit, offset} = getPagination(pageNumber, pageSize)
        const listProducts = await Product.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['name', 'asc']]
        })

        const responseData = getPagingData(listProducts, pageNumber, limit)

        res.status(200).json(successWithData('SUCCESS', responseData ))

    } catch (error) {
        throw new errorHandler(500, `Internal Server Error: ${error}`)
    }
}

// GET PRODUCT BY ID
async function getProductsByID(req, res, next){
    try {
        const {id_product} = req.params
        if(!id_product) throw new errorHandler(400, 'Bad Request: Please insert ID product')
        const findProduct = await Product.findByPk(id_product)
        if(!findProduct) throw new errorHandler(404, 'Product not found!')
        res.status(200).json(successWithData('SUCCESS', findProduct))
    } catch (error) {
        throw new errorHandler(500, `Internal Server Error: ${error}`)
    }
}


module.exports= {
    insertProduct,
    editProduct,
    deleteProduct,
    getProducts,
    getProductsByID
}