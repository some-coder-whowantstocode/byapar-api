const mongoose = require('mongoose')


const orderschema = new mongoose.Schema({
  products : [{
    type:mongoose.ObjectId,
    ref:"product"
  },
],
payment :{

},
buyer:{
    type:mongoose.ObjectId,
    ref:"User"
},
status:{
    type:String,
    default:'Not process',
    enum:['Not process',"processing","shipped","delivered","cancel"]
}
},{timestamps:true})

module.exports = mongoose.model('order',orderschema)
