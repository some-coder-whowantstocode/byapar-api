const express = require('express')
const router = express.Router()

const {
    getallproducts,
    createproduct,
    deleteproduct,
    updateproduct,
    getbycreater,
    searchproduct
} = require('../controller/controller')

router.get('/getallproducts',getallproducts)
router.post('/addproduct',createproduct)
router.post('/deleteproduct/',deleteproduct)
router.patch('/updateproduct/:id',updateproduct)
router.get('/getbycreater',getbycreater)
router.get('/search?',searchproduct)


module.exports=router