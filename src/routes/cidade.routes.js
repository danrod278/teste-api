const controller = require('../controllers/cidade.controller.js')

const express = require('express')
const router = express.Router()
router.get('/:uf',  controller.listarCidades)  

module.exports = router