const { Badrequest } = require('../customerr/badrequest')
const Cart = require('../model/cartmodel')
const Products = require('../model/model')

const searchproduct = async(req,res)=>{
    const {name,price,rating,ptype,numericalfilters} =req.query
    // console.log(req.query)
    const obj ={}
    if(name){
        obj.name = {$regex:name,$options:'i'}
    }
    if(ptype&&ptype!=''&&ptype!='ALL'){
    
        obj.ptype = ptype
    }
    // let result = await Products.find(obj)
    

    if(numericalfilters){
        const operatormap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx =  /\b(<|>|>=|<=|=)/g
        
        let filters = numericalfilters.replace(
            regEx,
            (match)=>`-${operatormap[match]}-`
        )
        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
          // console.log
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                obj[field] = {[operator]:Number(value)}
            }
        })
    }
   let result = await Products.find(obj)

    res.status(200).json(result)
}


const createproduct = async (req, res) => {
    const { name, description, price, rating, createdat, ptype } = req.body;
    const file = req.file;
  
    if (!name) {
      throw new Badrequest("Please provide name.", 400);
    }
    if (!description) {
      throw new Badrequest("Please provide description.", 400);
    }
    if (!price) {
      throw new Badrequest("Please provide price.", 400);
    }
    if (!file) {
      throw new Badrequest("Please provide image.", 400);
    }
    if (!ptype) {
      throw new Badrequest("please provide ptype.", 400);
    }
  
    if (!global.gfsBucket) {
        throw new Error('global.gfsBucket is not initialized');
      }
    const readstream = global.gfsBucket.openDownloadStreamByName(file.filename);
    let fileData = Buffer.from([]);
    readstream.on("data", (chunk) => {
      fileData = Buffer.concat([fileData, chunk]);
    });
    readstream.on("end", async () => {
      const createdby = req.user.userId;
      const product = await Products.create({
        name,
        description,
        price,
        image: fileData,
        createdby,
        rating,
        createdat,
        ptype,
      });
      res.status(201).json(product);
    });
  };
  
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

const getoneproduct = async(req,res)=>{
  const {id} = req.params;
  const p = await Products.findById({_id:id.slice(1,id.length)});
  if(!p){
    throw new Badrequest("Item does not exist.",400)
  }
  res.status(200).json(p)
}


const deleteproduct = async(req,res)=>{
   
    const {id} = req.body
    if(!id){
        throw new Badrequest('Please provide id.',400)
    }
    // console.log(req.body)
    const p = await Products.findById({_id:id})
   
    if(!p){
        throw new Badrequest('Item does not exist.',400)
    }
    const product = await Products.findByIdAndDelete({_id:id})
    const cart = await Cart.findOneAndDelete({productid:id})
    res.status(200).json(product)
}

const getbycreater =async(req,res)=>{
    const id = req.user.userId
    // console.log(id)
    const products = await Products.find({createdby:id})
    res.status(200).json(products)

}

module.exports = {
    getallproducts,
    createproduct,
    deleteproduct,
    updateproduct,
    getbycreater,
    searchproduct,
    getoneproduct
}