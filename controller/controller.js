const { Badrequest } = require('../customerr/badrequest')
const Products = require('../model/model')

const createproduct = async(req,res)=>{

   const {name,description,price,image} = req.body
   if(!name || !description || !price ||!image){
   throw new Badrequest('Please provide name,description and price of the item.',400)
   }

   const createdby = req.user.userId
//    console.log(req.user)
   const product = await Products.create({name,description,price,createdby})
    res.status(201).json(product)

}

const getallproducts = async(req,res)=>{
    const products = await Products.find()
    if(products.length == 0){
        throw new Badrequest('It is empty as the void itself.',200)
    }
    res.status(200).json(products)
}

const updateproduct = async(req,res)=>{
    const {id} = req.params
    const p = await Products.findById({_id:id})
    if(!p){
        throw new Badrequest('Item does not exist.',400)
    }
    const product = await Products.findByIdAndUpdate({_id:id},req.body, { returnDocument: 'after' })
    res.status(200).json(product)
}


const deleteproduct = async(req,res)=>{
    const {id} = req.params
    const p = await Products.findById({_id:id})
    if(!p){
        throw new Badrequest('Item does not exist.',400)
    }
    const product = await Products.findByIdAndDelete({_id:id})
    res.status(200).json(product)
}

module.exports = {
    getallproducts,
    createproduct,
    deleteproduct,
    updateproduct
}