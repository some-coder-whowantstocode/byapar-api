const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name.']
    },
    email:{
        type:String,
        required:[true,'Please provide email.'],
        unique:true,
        match:[/.+\@.+\..+/,'Please provide a valid email.']
    },
    password:{
        type:String,
        required:[true,'Please provide a password.'],
        minlength:[6,'The password must be longer than 6.']
    }
})

userschema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(this.password,salt)

    this.password = hashedpassword
    next()
})

userschema.methods.createtoken = async function(){
  
   return jwt.sign({name:this.name,id:this.id},process.env.secretkey ,{expiresIn:process.env.lifespan})
  
}

userschema.methods.iscorrect =async function(givenpassword){
    const ismatch = await bcrypt.compare(givenpassword,this.password)
    return ismatch
 }

module.exports = mongoose.model('user',userschema)