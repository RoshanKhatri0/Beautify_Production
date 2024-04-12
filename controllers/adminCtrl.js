const beauticianProfileModel = require('../models/beauticianProfileModel')
const userModel = require('../models/userModel')
const User= require ('../models/userModel')

exports.getAllUsers = async(req,res) =>{
    try {
        const users = await User.find({})
        res.status(200).json({
            success: true, message:'users data', data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'error while fetching users', error})
    }
}
exports.getAllBeauticians = async(req,res) =>{
    try {
        const beauticians = await beauticianProfileModel.find({})
        res.status(200).json({
            success: true, message:'beautician data', data: beauticians
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'error while fetching users', error})
    }
}
// change account status
exports.changeAccountStatusCtrl = async(req,res) =>{
    try {
        const {bId, status} = req.body
        const beauticians = await beauticianProfileModel.findByIdAndUpdate(bId,{status})
        const user = await userModel.findOne({_id:beauticians.userId})
        const notification = user.notification
        notification.push({
            type:'Beautician-account-request-updated',
            message:`Your Beautcian Account Request Has Been ${status}`,
            onClickPath:'/notification'
        })
        if (status === 'approved') {
            user.role = 2
        } 
        await user.save()
        res.status(201).json({success:true, message: 'Account Status Updated', data: beauticians})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Error in Account Status', error})
    }
}