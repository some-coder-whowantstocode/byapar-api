require('express-async-errors')

const express = require('express')
const app = express()
const authenticate = require('./middleware/authentication')
require('dotenv').config()
const router = require('./routes/route')
const userrouter = require('./routes/userroute')
const errorhandler = require('./middleware/errhandler')
const connect = require('./db/connect')



const port = process.env.PORT || 3000
app.use(express.json())

app.use('/byapar/api/v1/user/',userrouter)
app.use('/byapar/api/v1/',authenticate,router)

app.get('/',(req,res)=>{
    res.send('hi')
})


const start =async(url)=>{
    try{
       await connect(url)
        app.listen(port,console.log(`App is listning at ${port}......`))


    }catch(error){
        console.log(error)
    }
}

app.use(errorhandler)

start(process.env.connecturl)
