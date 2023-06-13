const express = require('express')
const router = express.Router()

const {addtocart,removefromcart} = require('../controller/cartcontroller')


router.post('/addtocart/:id',addtocart)
router.post('/removefromcart',removefromcart)

module.exports = router
