const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', (req, res, next) => {
    console.log("Entrou na rota /")
    res.status(200).send({
        name: "API Daniel",
        title: "Uma ferramententa moderna para filtro e insights de leilões de imoveis",
        author: "Robson Rodrigues da Silva",
        licence: {
            "CONCESSÃO DE LICENÇA":"A utilização deste serviso é concedida mediante a aceitação dos termos e condições de uso. Ao utilizar este serviço, você concorda com os termos e condições de uso. Caso não concorde com os termos e condições de uso, não utilize este serviço.",
            "CONFORMIDADE COM LGPD":"Estamos comprometidos em proteger e respeitar a privacidade de nossos usuários, estando em conformidade com a Lei Geral de Proteção de Dados (LGPD). No entanto, somos apenas uma plataforma que atua como ponte entre os estabelecimentos e os clientes. A coleta, armazenamento e tratamento de dados pessoais realizados pelos estabelecimentos são de responsabilidade exclusiva deles",
            "ISENÇÃO DE RESPONSABILIDADE":"Nós atuamos apenas como uma plataforma intermediária entre estabelecimentos e clientes. Não nos responsabilizamos por qualquer desavença, ofensa ou qualquer outra forma de conflito que possa surgir entre os estabelecimentos e os clientes. Qualquer reclamação, controvérsia ou disputa deve ser tratada diretamente entre as partes envolvidas.",
            
        },
        version: "0.0.1",
    })
})

module.exports = router

router.post('/register', userController.register)