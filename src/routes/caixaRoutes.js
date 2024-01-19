const express = require('express')
const router = express.Router()
const caixaController = require('../controllers/caixaController')

router.get('/iniciarBuscaCidades', caixaController.runGetCidades)
router.get('/getAllCidades', caixaController.getAllCidades)
router.get('/iniciarBuscaImoveis', caixaController.obterTodosImoveis)
router.get('/buscarComFiltro', caixaController.getImoveisWithFilters)
router.get('/iniciarBuscaImoveis/cidade/:cidade', caixaController.obterTodosImoveisPorCidade)
router.get('/iniciarBuscaImoveis/estado/:uf', caixaController.obterTodosImoveisPorEstado)
router.get('/', caixaController.getImovelcaixa)


module.exports = router

