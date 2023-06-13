const express = require('express')
const router = express.Router()

const {
    getallproducts,
    createproduct,
    deleteproduct,
    updateproduct,
    getbycreater
} = require('../controller/controller')

router.get('/getallproducts',getallproducts)
router.post('/addproduct',createproduct)
router.delete('/deleteproduct/:id',deleteproduct)
router.patch('/updateproduct/:id',updateproduct)
router.get('/getbycreater',getbycreater)


module.exports=router