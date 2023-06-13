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
    }
})

module.exports = mongoose.model('cart',cartschema)