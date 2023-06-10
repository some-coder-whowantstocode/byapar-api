const {Badrequest} = require('../customerr/badrequest')

const errorhandler = (err,req,res,next)=>{
    console.log(err)
        if(err instanceof Badrequest){
            return res
            .status(err.statuscode)
            .json({msg:err.message})
        }
        else{
            return res
            .status(500)
            .json(
                {msg:err.message||"something went wrong in the server"}
                )
        }
        
}

module.exports = errorhandler