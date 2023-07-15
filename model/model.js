const mongoose = require('mongoose')

const usermodel = require('./usermodel')
const { ObjectId } = require('mongodb')

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
    ptype:{
        type:String,
        enum:{
            values:['MEN','WOMEN','CHILDREN','FOOD'],
            message:'{value}  is not supported'
        },
        required:[true,'Ptype is required e.g MEN,FOOD etc.']
    },
    image:{
        type:String
    },
    createdat:{
        type:Date,
        default:Date.now()
    },
    rating:{
        type:Number,
        default:0
    },
    gridid:{
        type:ObjectId,
        required:[true,'please provide gridid']
    }
})


module.exports = mongoose.model('products',productschema)