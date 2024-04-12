const mongoose = require('mongoose')

const contactInfoSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        trim: true
    }
})

const socialsSchema = new mongoose.Schema({
    instragram:{
        type: String,
        trim: true
    },
    facebook:{
        type: String,
        trim: true
    },
    tiktok:{
        type: String,
        trim: true
    }
})

const bProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
      },
    beautician_name:{
        type:String,
        required:true,
        trim:true
    },
    beautician_bio:{
        type:String,
        required:true,
        trim:true
    },
    beautician_profilepic:{
        type:String,
        required:true,
    },
    experience:{
        type:String
    },
    gallery:{
        type:Array,
        default:[]
    },
    pricing:{
        type:String
    },
    services_offered:{
        type:String,
        required:true,
        trim:true
    },
    working_hours:{
        type:String,
    },
    certifications:{
        type:String
    },
    rating:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default: 'Pending'
    },
    contact_info:contactInfoSchema,
    socials:socialsSchema
},{timestamps:true})

module.exports=mongoose.model('B_Profile',bProfileSchema)