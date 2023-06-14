const { Badrequest } = require('../customerr/badrequest')
const Cart = require('../model/cartmodel')


const addtocart = async(req,res)=>{
    const {productid} = req.body

    if( !productid){
        throw new Badrequest('please provide productid .',404)
    }
    const check = await Cart.findOne({productid:productid})
    if(check){
        res.status(200).json({msg:'item already exists.'})
    }else{
        const cart = await Cart.create({addedby:req.user.userId,productid})

        res.status(200).json(cart)
    }
   
}

const removefromcart = async(req,res)=>{
    const {productid} = req.body
    if(!productid){
        throw new Badrequest('please provide productid.',400)
    }
    const cart = Cart.findByIdAndDelete({productid:productid})
    res.status(200).json(cart)
}

module.exports ={
    addtocart,
    removefromcart
}
