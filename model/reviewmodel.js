const mongoose = require('mongoose')


const reviewschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    product:{
        type:String,
        required:[true,'item not specified.']
    },
    title:{
        type:String,
        required:[true,'please provide a title.']
    },
    review:{
        type:String,
        required:[true,'please provide a review.']
    }
})

module.exports = mongoose.model('review',reviewschema)
