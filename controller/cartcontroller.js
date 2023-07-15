const { ObjectId } = require('mongodb');
const { Badrequest } = require('../customerr/badrequest');
const Cart = require('../model/cartmodel');
const { GridFSBucket, MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const { stringmodifier } = require('../utility/stringmodifier');
const { getfromgrid } = require('../utility/getfromgrid');


const uri = process.env.connecturl;
const dbname = 'productimages';



const addtocart = async(req,res)=>{
    const {productid,price,name,gridid} = req.body;
    
    if( !productid || !price || !name || !gridid){
        throw new Badrequest('please provide productid,price and name.',404)
    }
    const check = await Cart.findOne({productid:productid,addedby:req.user.userId})
    if(check){
        res.status(200).json({msg:'item already exists.'})
    }else{
        const cart = await Cart.create({addedby:req.user.userId,productid,price,name,gridid})

        res.status(200).json(cart)
    }
   
}

const getfromcart = async(req,res)=>{
    const {userId} = req.user

  
    const items = await Cart.find({addedby:userId})
  
    let gridfile = await getfromgrid(items)
    // console.log(gridfile)

    res.status(200).json({items:items,grid:gridfile})
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
