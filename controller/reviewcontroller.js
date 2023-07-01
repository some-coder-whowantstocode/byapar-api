const Review = require('../model/reviewmodel');
const {Badrequest} = require('../customerr/badrequest');


const addreview = async(req,res)=>{
    const {product,title,review} = req.body;
    // console.log(req.body)
    if(!product || !title || !review){
        throw new Badrequest("please provide product,title and review.",500);
    }
    const ifexist = await Review.findOne({
        userid:req.user.userId,
        product:product
    });

    if(ifexist){
        throw new Badrequest("Already given a review for this product.",409);
    }
    else{
        const rw = await Review.create({
            userid:req.user.userId,
            title,
            product,
            review,
            name:req.user.name
        })
        res.status(200).json({rw})
    }
   
}


const getreviewbyproduct = async(req,res)=>{
    const {id} = req.params;
    // console.log(id)
    if(!id){
        throw new Badrequest('Please provide id.',500);
    }
    const reviews = await Review.find({product:id})
    // console.log(reviews)
    res.status(200).json(reviews);
}

const removereview = async(req,res)=>{
    const {id} = req.params;
    // console.log(id)
    if(!id){
        throw new Badrequest("please provide id.",500);
    }
    const exists = await Review.findById({_id:id});
    if(!exists){
        throw new Badrequest('Item doesnot exist.',404);
    }
    const review = await Review.findByIdAndDelete({_id:id});
    res.status(200).json(review);
}


module.exports ={
    addreview,
    getreviewbyproduct,
    removereview
}
