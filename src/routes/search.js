const express = require('express')
const router = express.Router()
const controller = require('../controllers/SearchController')

router.get('/:slug', controller.getAll, controller.index)

module.exports = router