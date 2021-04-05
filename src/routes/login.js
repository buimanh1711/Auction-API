const express = require('express')
const router = express.Router()
const login = require('../api/Account/login')
const auth = require('../middleware/auth')
const getUser = require('../utils/getUser')

router.post('/', login)
// router.get('/', auth, getUser, controller.checkLogin)


module.exports = router