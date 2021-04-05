const express = require('express')
const router = express.Router()
const search = require('../api/Account/search')
const deleteUser = require('../api/Account/delete')
const auth = require('../middleware/auth')
const getUser = require('../utils/getUser')

router.get('/:slug', search)
router.post('/:userId', auth, getUser, deleteUser)


module.exports = router