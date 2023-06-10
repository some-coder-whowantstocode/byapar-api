const express = require('express')
const router = express.Router()

const {
    getallproducts,
    createproduct,
    deleteproduct,
    updateproduct
} = require('../controller/controller')

router.get('/getallproducts',getallproducts)
router.post('/addproduct',createproduct)
router.delete('/deleteproduct/:id',deleteproduct)
router.patch('/updateproduct/:id',updateproduct)


module.exports=router