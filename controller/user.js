const User = require('../model/usermodel')
const {Badrequest} = require('../customerr/badrequest')

const register = async(req,res)=>{
  
        const {name,email,password} = req.body

        if(!name || !email || !password){
            throw new Badrequest('please provide name,email and password.',400)
        }
        const box = {name,email,password}
        const user = await User.create(req.body)
        const token = await user.createtoken()
        res.status(201).json({user:name,token:token})
   
}


const login = async(req,res)=>{
    const {email,password} = req.body

    if(!email||!password){
        throw new Badrequest('please provide correct email and password.',400)
    }
    const user = await User.findOne({email})
    if(!user){
       return res.status(200).json({msg:'User doesnot exist please register the user.'})
    }
    const validpass = await user.iscorrect(password)
    if(!validpass){
       return res.status(401).json({msg:'Invalid password.'})
    }
    const token = await user.createtoken()
    res.status(200).json({msg:'successfully logged in',details:{user:user.name,token:token}})
}

module.exports = {
    register,
    login
}