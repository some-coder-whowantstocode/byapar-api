require('express-async-errors');
const cors = require('cors');
const express = require('express');
const app = express();
const authenticate = require('./middleware/authentication');
require('dotenv').config();
const router = require('./routes/route');
const userrouter = require('./routes/userroute');
const cartrouter = require('./routes/cartroute');
const reviewrouter = require('./routes/reviewroute');
const errorhandler = require('./middleware/errhandler');
const {connect} = require('./db/connect');
const multer = require('multer');
const path = require('path');
const {GridFsStorage} = require('multer-gridfs-storage')
const methodoverride = require('method-override');
const mongoose = require('mongoose');
const crypto =require('crypto');
const eventemmiter = require('events');
const myemmiter = new eventemmiter();
const bodyParser = require('body-parser');


app.use(bodyParser.json({ limit: '50mb' }));


app.use(cors({
    origin: process.env.baseurl,
    methods:["GET","POST","PATCH","DELETE"]
  }))

const port = process.env.PORT || 3000
app.use(express.json())


const start =async(url)=>{
    try{
       await connect(url);
       
  
        app.listen(port,console.log(`App is listning at ${port}......`));


    }catch(error){
        console.log(error)
    }
}







// console.log(upload)

app.use('/byapar/api/v1/user/',userrouter)
app.use('/byapar/api/v1/',authenticate,router)
app.use('/byapar/api/v1/',authenticate,cartrouter)
app.use('/byapar/api/v1/',authenticate,reviewrouter)

app.get('/',(req,res)=>{
    res.send('hi')
})




app.use(errorhandler)

start(process.env.connecturl)
