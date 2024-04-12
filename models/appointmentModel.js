const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    beauticianId:{
        type: String,
        required: true
    },
    beauticianInfo:{
        type: String,
        required: true
    },
    userInfo:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    service:{
        type: String,
        required: true
    },
    remark:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'pending'
    },
},{timestamps:true})

module.exports=mongoose.model('Appointment',appointmentSchema)