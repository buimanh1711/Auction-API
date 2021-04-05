const express = require('express')
const router = express.Router()
const login = require('../api/Sign/login')

router.post('/', login)

module.exports = router