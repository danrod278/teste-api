const express = require('express')
const router = express.Router()

const isAdmin = require('../middlewares/roles')
const UserController = require('../controllers/userController')

// router.post('/register', UserController.register)
router.get('/', isAdmin, UserController.findAll)
router.post('/', isAdmin,  UserController.create)
router.get('/setuserdefault',  UserController.createUserDefault)


router.post('/login', UserController.login)

module.exports = router
router.get('/:id',  UserController.findUser)

module.exports = router