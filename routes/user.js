const userController = require('../seeders/userController')
const express = require('express')
const ROUTER = express.Router()

ROUTER.get('/', userController.getUserById)
ROUTER.get('/list', userController.getListUser)
ROUTER.put('/edit', userController.editUser)
ROUTER.delete('/delete', userController.deleteUser)

module.exports = ROUTER