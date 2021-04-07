const express = require('express')
const router = express.Router()
const search = require('../api/Account/search')
const deleteUser = require('../api/Account/delete')
const notify = require('../api/Account/notify')
const getNotify = require('../api/Account/getNotify')
const auth = require('../middleware/auth')
const getUser = require('../utils/getUser')

router.get('/:slug', search)
router.get('/v/notify', auth, getUser, getNotify)
router.post('/:userId', auth, getUser, deleteUser)


module.exports = router