const {Router} = require('express');
const { FormModel } = require('../models/Form.model');

const formRoutes=Router();

formRoutes.get('/:ID',async(req,res)=>{
    const forms=await FormModel.findOne({"formID":req.params.ID})
    console.log(forms);
    res.send(forms)
})

formRoutes.post('/new',async(req,res)=>{
    try {
      const form = new FormModel(req.body);
      await form.save();
      res.status(200).send(form);
    } catch (error) {
        res.send({"msg":error.message})
    }
})

module.exports={formRoutes}