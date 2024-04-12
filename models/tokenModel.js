const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema

const TokenSchema= mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    userId:{
        ref:'users',
        required:true,
        type:ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400
    }

})

module.exports=mongoose.model('Token',TokenSchema)