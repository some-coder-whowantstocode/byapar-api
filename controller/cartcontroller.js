const { Badrequest } = require('../customerr/badrequest')
const Cart = require('../model/cartmodel')


const addtocart = async(req,res)=>{
    const {productid} = req.body

    if( !productid){
        throw new Badrequest('please provide productid .',404)
    }
    const cart = Cart.create({addedby:req.user.userId,productid})

    res.status(200).json(cart)
}

const removefromcart = async(req,res)=>{
    const {id} = req.params
    if(!id){
        throw new Badrequest('please provide id.',400)
    }
    const cart = Cart.findByIdAndDelete({_id:id})
    res.status(200).json(cart)
}

module.exports ={
    addtocart,
    removefromcart
}
