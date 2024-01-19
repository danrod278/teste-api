const express = require('express')
const router = express.Router()
const imovelController = require('../controllers/imovelController')

router.post('/', imovelController.listarImoveis)
router.post('/', imovelController.cadastrarImovel)
router.post('/statusupdate', imovelController.atualizarStatusImoveis)
router.get('/:id', imovelController.obterImovelPeloId)

module.exports = router