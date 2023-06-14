const express = require('express')
const router = express.Router()

const {addtocart,removefromcart,getfromcart} = require('../controller/cartcontroller')


router.post('/addtocart/:id',addtocart)
router.post('/removefromcart',removefromcart)
router.get('/getfromcart',getfromcart)

module.exports = router
