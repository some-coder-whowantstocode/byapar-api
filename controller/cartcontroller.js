const { Badrequest } = require('../customerr/badrequest')
const Cart = require('../model/cartmodel')


const addtocart = async(req,res)=>{
    const {productid,price,name} = req.body;
    
    if( !productid || !price || !name){
        throw new Badrequest('please provide productid,price and name.',404)
    }
    const check = await Cart.findOne({productid:productid,addedby:req.user.userId})
    if(check){
        res.status(200).json({msg:'item already exists.'})
    }else{
        const cart = await Cart.create({addedby:req.user.userId,productid,price,name})

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
    const c = await Cart.find({_id:_id})
    if(!c){
        throw new Badrequest('Item does not exist.',400)
    }
    // console.log(_id)
    const cart = await Cart.findByIdAndDelete({_id:_id,addedby:req.user.userId})
    res.status(200).json(cart)
}

module.exports ={
    addtocart,
    removefromcart,
    getfromcart
}
