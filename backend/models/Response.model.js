const mongoose=require('mongoose');

const responseSchema=mongoose.Schema({
    formID:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    responses:{type:Array,required:true}
},{
    versionKey:false
})

const ResponseModel=mongoose.model('response',responseSchema)

module.exports={ResponseModel}