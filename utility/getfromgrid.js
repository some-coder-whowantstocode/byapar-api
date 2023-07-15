const { Badrequest } = require("../customerr/badrequest");
const { GridFSBucket, MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');
const { stringmodifier } = require("./stringmodifier");

const uri = process.env.connecturl;
const dbname = 'productimages';


async function getfromgrid(items){

  
    try{

        const client = await MongoClient.connect(uri);
        const db = client.db(dbname);
    
        const bucket = new GridFSBucket(db,{bucketName:'mycustombucket'});
        // console.log(bucket)
    

        const file = items.map((item)=>{
            return bucket.find({_id:item.gridid}).toArray();
        })
        //  await bucket.find({_id:items[0].gridid}).toArray();
        let files =await Promise.all(file)
        // console.log(files)

    
        const promises = files.map((file)=>{
            // console.log(file)
            const downloadstream = bucket.openDownloadStream(file[0]._id);
            let buffer = Buffer.alloc(0);
            
    
            return new Promise((resolve,reject)=>{
                downloadstream.on('data',(chunk)=>{
                    buffer = Buffer.concat([buffer,chunk]);
                });
                downloadstream.on('error',reject);
                downloadstream.on('end',()=>resolve(buffer));
            })
        })
    
        try{
            const result = await Promise.all(promises);
            for(let i=0;i<result.length;i++){
            files[i][0].chunk = await stringmodifier( result[i].toString('base64'));
            }
        }catch(error){
            console.log('error at cartcontroller.');
        }
    
        const gridfile = [];
        for(let i =0;i<file.length;i++){
            // console.log(file)
            gridfile[i] = files[i][0];
        }
    
        return gridfile;
    }catch(error){
        new Badrequest('someerror',500)
    }
   
}

module.exports = {
    getfromgrid
}