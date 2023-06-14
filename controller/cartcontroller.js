const { Badrequest } = require('../customerr/badrequest')
const Cart = require('../model/cartmodel')


const addtocart = async(req,res)=>{
    const {productid,price,name,image} = req.body

    if( !productid || !price || !name || !image){
        throw new Badrequest('please provide productid,price name and image.',404)
    }
    const check = await Cart.findOne({productid:productid,addedby:req.user.userId})
    if(check){
        res.status(200).json({msg:'item already exists.'})
    }else{
        const cart = await Cart.create({addedby:req.user.userId,productid,price,name,image})

        res.status(200).json(cart)
    }
   
}

const getfromcart = async(req,res)=>{
    const {userId} = req.user

    const items = await Cart.find({addedby:userId})
    res.status(200).json(items)
}

const removefromcart = async(req,res)=>{
    const {_id} = req.body
    if(!_id){
        throw new Badrequest('please provide productid.',400)
    }
    const c = Cart.find({_id:_id})
    if(!c){
        throw new Badrequest('Item does not exist.',400)
    }
    console.log(_id)
    const cart = Cart.findByIdAndDelete({_id:_id,addedby:req.user.userId})
    res.status(200).json(cart)
}

module.exports ={
    addtocart,
    removefromcart,
    getfromcart
}
