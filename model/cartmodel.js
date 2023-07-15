const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')


const cartschema = new mongoose.Schema({
    addedby:{
        type:String,
        required:[true,'user not provided.']
    },
    productid:{
        type:ObjectId,
        required:[true,'product not specified.']
    },
    name:{
        type:String,
        required:[true,'name not specified.']
    },
    price:{
        type:Number,
        required:[true,'price not specified.']
    },
    gridid:{
        type:ObjectId,
        required:[true,'gridid is required.']
    }
})

module.exports = mongoose.model('cart',cartschema)