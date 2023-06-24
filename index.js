require('express-async-errors');
const cors = require('cors');
const express = require('express');
const app = express();
const authenticate = require('./middleware/authentication');
require('dotenv').config();
const router = require('./routes/route');
const userrouter = require('./routes/userroute');
const cartrouter = require('./routes/cartroute');
const errorhandler = require('./middleware/errhandler');
const connect = require('./db/connect');
const multer = require('multer');
const Grid = require('gridfs-stream');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const methodoverride = require('method-override');
const { default: mongoose } = require('mongoose');
const { rejects } = require('assert');

app.use(cors({
    origin: process.env.baseurl,
    methods:["GET","POST","PATCH","DELETE"]
  }))

const port = process.env.PORT || 3000
app.use(express.json())

const start =async(url)=>{
    try{
      const conn = await connect(url)
      let gfs ;
      conn.once('open',()=>{
        //init stream
        gfs = Grid(conn.db,mongoose.mongo);
        gfs.collection('uploads');
      })

      const storage = new GridFsStorage({
        url : url,
        file:(req,file) =>{
            return new Promise((resolve,reject)=>{
                crypto.randomBytes(16,(err,buf)=>{
                    if(err){
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileinfo = {
                        filename:filename,
                        bucketName:'uploads'
                    };
                    resolve(filename);
                });
            });
        }
      })
      const upload = multer({storage})

    //   create storage


     

        app.listen(port,console.log(`App is listning at ${port}......`))


    }catch(error){
        console.log(error)
    }
}

app.use('/byapar/api/v1/user/',userrouter)
app.use('/byapar/api/v1/',authenticate,upload.single('file'),router)
app.use('/byapar/api/v1/',authenticate,cartrouter)

app.get('/',(req,res)=>{
    res.send('hi')
})




app.use(errorhandler)

start(process.env.connecturl)
