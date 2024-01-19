const express = require('express')
const router = express.Router()

const { Leilao } = require('../models/leilaoModel')

router.post('/', (req, res, next) => {
    Leilao.create(req.body)
        .then(leilao => {
            res.json(leilao);
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }
            next(err);
        });
});


module.exports = router