const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const getUser = require('../utils/getUser')

const getOne = require('../api/Profile/getOne')
const editInfo = require('../api/Profile/editInfo')

router.get('/:userId', getUser, getOne)
router.post('/:userId', auth, getUser, editInfo)
module.exports = router