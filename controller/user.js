const User = require('../model/usermodel')
const {Badrequest} = require('../customerr/badrequest')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const register = async(req,res)=>{
  
        const {name,email,password} = req.body

        if(!name || !email || !password){
            throw new Badrequest('please provide name,email and password.',400)
        }
        const box = {name,email,password}
        const user = await User.create(req.body)
        const token = await user.createtoken()
        res.status(201).json({details:{user:name,token:token}})
   
}


const login = async(req,res)=>{
    const {email,password} = req.body

    if(!email||!password){
        throw new Badrequest('please provide correct email and password.',400)
    }
    const user = await User.findOne({email})
    if(!user){
    throw new Badrequest('User not found.',404)
    }
    const validpass = await user.iscorrect(password)
    if(!validpass){
       return res.status(401).json({msg:'Invalid password.'})
    }
    const token = await user.createtoken()
    res.status(200).json({msg:'successfully logged in',details:{user:user.name,token:token}})
}

const authcheck =async(req,res)=>{
    const {token} = req.body
    console.log(token)
    if(!token || !token.startsWith('Bearer')){
        throw new Error('Authontication failed')
    }


    const toke = await token.split(' ')[1]
    console.log(toke)
   
        const payload = jwt.verify(toke,process.env.secretkey)
        console.log(process.env.secretkey)
        res.status(200).json({userId:payload.id,name:payload.name})
 
}

module.exports = {
    register,
    login,
    authcheck
}