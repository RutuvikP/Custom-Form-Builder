const express=require('express');
const cors=require('cors');
const { connection } = require('./configs/db');
const { formRoutes } = require('./routes/Form.routes');
const { responseRouter } = require('./routes/Response.routes');
const app=express();

app.use(cors())
app.use(express.json())

app.use('/forms',formRoutes)
app.use('/response',responseRouter)

app.get("/",(req,res)=>{
    res.send("Welcome to Backend!!")
})

app.listen(8080,async()=>{
    try {
        await connection
        console.log("Connected to DB!!")
    } catch (error) {
        console.log(error)
    }
    console.log("Server is Running on Port 8080!!")
})