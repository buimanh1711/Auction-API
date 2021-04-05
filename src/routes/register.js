const express = require('express')
const router = express.Router()
const register = require('../api/Account/register')

router.post('/', register)


module.exports = router