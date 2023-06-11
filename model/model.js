const mongoose = require('mongoose')

const usermodel = require('./usermodel')

const productschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide a name.']
    },
    description:{
        type:String,
        required:[true,'please provide product description.'],
        maxlength:300
    },
    price:{
        type:Number,
        required:[true,'please provide price for the product.']
    },
    createdby:{
        type:String,
        required:[true,'looks like some error occured.']
    },
    image:{
        type:String
    }
})


module.exports = mongoose.model('products',productschema)