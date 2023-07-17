const { GridFSBucket, MongoClient } = require('mongodb');
const { Badrequest } = require('../customerr/badrequest')
const Cart = require('../model/cartmodel')
const Products = require('../model/model')
const mongodb = require('mongodb');
const { stringmodifier } = require('../utility/stringmodifier');
const { uploadbase64stringtogridfs } = require('../utility/uploadtogrid');
const { getfromgrid } = require('../utility/getfromgrid');
const Review= require('../model/reviewmodel');
const ordermodel = require('../model/ordermodel');
const crypto = require('crypto')

const uri = process.env.connecturl;
const dbname = 'productimages';



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

  let gridfile = await getfromgrid(result)

res.status(200).json({product:result,grid:gridfile})



}



const createproduct = async (req, res) => {
    const { name, description, price,file, rating, createdat, ptype } = req.body;
    const gridid =  await uploadbase64stringtogridfs(file,name);
    // console.log(req.body)
    if(!gridid){
      throw new Badrequest("Image couldnot be uploaded.", 400);
    }
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

    console.log(req.user)

   try {
     const p = await Products.create({
       name,
       description,
       price,
       ptype,
       createdby:req.user.userId,
       gridid
     })

     const id = p._id;
     console.log(id);

    

     res.status(200).json({product:p})
   } catch (err) {
     res.status(500).json({message:err.message})
   }

  };



const getallproducts = async(req,res)=>{
  const products = await Products.find();
  if(products.length ==0){
    throw new Badrequest('This is empty as the void itself',200);
  }

  let files = await getfromgrid(products)

  res.status(200).json({products:products,grids:files})
  
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

    const client = await MongoClient.connect(uri);
    const db = client.db(dbname);

    const bucket = new GridFSBucket(db,{bucketName:'mycustombucket'});
   
    if(!p){
        throw new Badrequest('Item does not exist.',400)
    }
    let prod = await Products.findOne({_id:id})
   await bucket.delete(prod.gridid,function(error){
    if (error) {
      console.log('Error deleting file:', error);
    } else {
      console.log('File deleted successfully!');
    }
   })
   
   const review = await Review.findOneAndDelete({userid:id});
    const product = await Products.findByIdAndDelete({_id:id})
    const cart = await Cart.findOneAndDelete({productid:id})

    res.status(200).json(product)
}

const getbycreater =async(req,res)=>{
    const id = req.user.userId
    // console.log(id)
    const products = await Products.find({createdby:id});
    let file = await getfromgrid(products);
    res.status(200).json({product:products,grids:file});

}



function generateHash(params, salt) {
  let hashString = params["key"] + "|" + params["txnid"] + "|" + params["amount"] + "|" + params["productinfo"] + "|" + params["firstname"] + "|" + params["email"] + "||||||" + salt;

  // Generate the hash
  const hash = sha512(hashString);

  return hash;
}


function sha512(str) {
  return crypto.createHash("sha512").update(str).digest("hex");
}


const paymentcontroller =async(req,res)=>{
  const {phone,amount,productinfo,firstname,email} = req.body;
  // console.log(req.body)

  if(!phone||!amount||!productinfo||!firstname||!email){
    throw new Badrequest('please add phone,amount,productinfo,firstname,email',400)
  }

  const params = {
    "key": process.env.merchantkey,
    "txnid": process.env.txnid + Date.now(),
    "amount": amount,
    "productinfo": productinfo,
    "firstname": firstname,
    "email": email,
    "phone": phone,
    "surl": process.env.surl,
    "furl": process.env.furl,
  };

  const hash = generateHash(params, process.env.merchantsalt);
  params["hash"] = hash;

  const encodedParams = new URLSearchParams(params).toString();

  const url = process.env.apiendpoint + "?" + encodedParams;

  // console.log(url);

  res.status(200).json({url:url})
  
}




module.exports = {
    getallproducts,
    createproduct,
    deleteproduct,
    updateproduct,
    getbycreater,
    searchproduct,
    getoneproduct,
    paymentcontroller
}