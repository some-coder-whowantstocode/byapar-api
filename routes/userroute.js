const express = require('express')
const router = express.Router()

const {
    register,
    login,
    authcheck
} = require('../controller/user')

router.post('/register',register)
router.post('/login',login)
router.post('/auth',authcheck)


module.exports = router