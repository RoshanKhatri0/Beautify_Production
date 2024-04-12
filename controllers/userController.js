const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const crypto = require('crypto');
const Token = require('../models/tokenModel');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res) => {
    try {
        const emailLowercase = req.body.email.toLowerCase();
        let user = await User.findOne({ email: emailLowercase });

        if (user) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        user = new User({
            name: req.body.name,
            email: emailLowercase,
            password: req.body.password, 
        });

        user = await user.save();

        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            userId: user._id,
        });

        token = await token.save();
        
        return res.status(200).json({ message: 'User created successfully', success: true, user });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'An error occurred during the registration process' });
    }
};

exports.signIn = async(req,res)=>{
    const { email, password } = req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(503).json({message: "User doesnot exist", success: false})
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({ error: 'email and password doesnot match', success: false })
        }
        //now generate token with user id and jwt secret
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET , {expiresIn: "1d"})
    res.status(200).json({ message:"Login Successfull", success: true, token})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Error logging in", success:false, error})
    }
}

exports.authController = async(req,res) =>{
    try{
        const user = await User.findById({_id:req.body.userId})
        user.password = undefined
        user.hashed_passwordpassword = undefined
        user.salt = undefined

        if(!user){
            return res.status(200).json({message:'user not found',success:false})
        }
        else{
            res.status(200).json({
                success:true,
                data: user
            })
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:'auth error',success:false,error})
    }
}

exports.getAllNotificationController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const seennotification = user.seennotification
        const notifications = user.notification

        seennotification.push(...notifications)
        user.notification = []
        user.seennotification = notifications

        const updatedUser = await user.save()

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            data: updatedUser
        })
    } catch (error) {
        console.error('Error in getAllNotificationController:', error)
        res.status(500).json({
            success: false,
            message: 'Error in notification',
            error: error.message 
        })
    }
}

exports.deleteAllNotification = async(req,res) =>{
    try{
        const user = await User.findOne({_id:req.body.userId})
        user.seennotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined   
        res.status(200).json({success:true, message:'Notification Deleted SuccessFfully', data: updatedUser})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:'unable to delete all notification',error})
    }
}

// Book appointment controller
exports.bookAppointment = async(req,res) =>{
    try {
        req.body.status = 'pending'
        const newAppointment = new Appointment(req.body)
        await newAppointment.save()
        const user = await User.findOne({_id: req.body.beauticianInfo.userId})
        user.notification.push({
            type:'New-Appointment-Request',
            message:` A new appointment request from ${req.body.userInfo.name}`,
            onClickPath: '/appointments'
        })
        await user.save()
        res.status(200).json({success:true, message:'Appointment Booked Successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error, success: false, message:"Error while booking appointment"})
    }
}
//appointment list
exports.userAppointmentList = async(req,res) =>{
    try {
        const appointments = await Appointment.find({userId: req.body.userId})
        res.status(200).json({success:true, message:'User Appointments fetched Successfully', data:appointments})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error, message:'Error in User Appointment List'})
    }
}