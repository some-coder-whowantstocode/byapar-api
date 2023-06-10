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
const url = process.env.connecturl
app.use(express.json())


app.use('/byapar/api/v1/',authenticate,router)
app.use('/byapar/api/v1/user/',userrouter)


const start =async()=>{
    try{
        await connect(url)
        app.listen(port,console.log(`App is listning at ${port}......`))

    }catch(error){
        console.log(err)
    }
}

app.use(errorhandler)

start()