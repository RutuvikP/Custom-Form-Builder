const mongoose = require('mongoose');

const formSchema=mongoose.Schema({
    formTitle:{type:String,required:true},
    questions:{type:Array, required:true},
    formID:{type:String,required:true}
})

const FormModel=mongoose.model('formdata',formSchema)

module.exports={FormModel}