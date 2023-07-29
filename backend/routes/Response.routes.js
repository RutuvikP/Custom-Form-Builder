const {Router}=require('express');
const { ResponseModel } = require('../models/Response.model');

const responseRouter=Router();

responseRouter.post('/add',async(req,res)=>{
    try {
        const response=new ResponseModel(req.body)
        await response.save()
        res.send({"msg":"Response Saved!!"})
    } catch (error) {
        res.send({"msg":error.message})
    }
})

module.exports={responseRouter}