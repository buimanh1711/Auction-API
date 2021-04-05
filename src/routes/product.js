const express = require('express')
const router = express.Router()
const getUser = require('../utils/getUser')
const auth = require('../middleware/auth')
const preHandle = require('../api/Product/preHandle')
const create = require('../api/Product/create')
const update = require('../api/Product/update')
const getById = require('../api/Product/getById')
const deleteProduct = require('../api/Product/delete')

// router.post('/unlike/:postId', auth, getUser, controller.unlike)
// router.post('/like/:postId', auth, getUser, controller.like)
// router.get('/comment/:postId', controller.getComment)
// router.post('/comment/:postId', auth, getUser, controller.createComment)
// router.get('/create', auth, controller.getCategories)
router.post('/delete/:productId', auth, getUser, deleteProduct)
router.get('/update/:productId', auth, getUser, getById)
router.post('/update/:productId', auth, getUser, preHandle, update)
router.post('/create', auth, getUser, preHandle, create)
// router.get('/v1/filter', controller.filter)
// router.get('/:slug', controller.show)
// router.get('/', controller.index)

module.exports = router