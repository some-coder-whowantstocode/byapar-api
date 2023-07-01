const mongoose = require('mongoose')


const cartschema = new mongoose.Schema({
    addedby:{
        type:String,
        required:[true,'user not provided.']
    },
    productid:{
        type:String,
        required:[true,'product not specified.']
    },
    name:{
        type:String,
        required:[true,'name not specified.']
    },
    price:{
        type:Number,
        required:[true,'price not specified.']
    }
})

module.exports = mongoose.model('cart',cartschema)