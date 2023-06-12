const User = require('../model/usermodel')
const jwt = require('jsonwebtoken')
const {Badrequest} = require('../customerr/badrequest')

const authenticate = async(req,res,next)=>{

    const authheader = req.headers.authorization
    console.log(authheader)
    if(!authheader || !authheader.startsWith('Bearer')){
        throw new Error('Authontication failed')
    }


    const token = await authheader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.secretkey)
        req.user = {userId:payload.id,name:payload.name}
        next()
    }catch(error){
        throw new Badrequest('Authontication faild',401)
    }

}

module.exports = authenticate