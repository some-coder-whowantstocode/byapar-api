const { MongoClient, GridFSBucket } = require("mongodb");


const uri = process.env.connecturl;
const dbname = 'productimages';


async function uploadbase64stringtogridfs(base64string,filename){
 

    const client = await MongoClient.connect(uri);
    const db = client.db(dbname);
  
    const bucket =  new GridFSBucket(db,{bucketName:'mycustombucket'});
  
    const decodedBuffer = Buffer.from(base64string,'base64');
    // console.log(decodedBuffer)
    try{
     const file  = bucket.openUploadStream(filename)
     file.end(decodedBuffer)
     if(file){
      // console.log(file.id);
     return file.id;
    }else{
      return false;
    }
    }catch(error){
      throw error
    }
  
   
    
  }


  module.exports = {
    uploadbase64stringtogridfs
  }