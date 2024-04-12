const B_Profile =require('../models/beauticianProfileModel');
const userModel = require('../models/userModel');
const Appointment = require('../models/appointmentModel');

exports.postB_Profile=async(req,res)=>{
    try{
        let b_profile = new B_Profile({
            userId: req.body.userId,
            beautician_name: req.body.beautician_name,
            beautician_bio: req.body.beautician_bio,
            beautician_profilepic: req.file.path,
            experience: req.body.experience,
            gallery: req.body.gallery,
            pricing: req.body.pricing,
            services_offered: req.body.services_offered,
            working_hours: req.body.working_hours,
            certifications: req.body.certifications,
            contact_info: {
                email: req.body.contact_info.email,
                phoneNumber: req.body.contact_info.phoneNumber
              },
              socials: {
                instragram: req.body.socials.instragram,
                facebook: req.body.socials.facebook,
                tiktok: req.body.socials.tiktok
              }
            
        })
        await b_profile.save()
        const adminUser = await userModel.findOne({role:1})
        const notification = adminUser.notification
        notification.push({
            type:"apply-beautician-request",
            message: `${b_profile.beautician_name} has applied for a Beautician Account`,
            data:{
                b_Id: b_profile._id,
                name: b_profile.beautician_name,
                onClickPath:'/admin/beuticians'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, {notification})
        res.status(201).json({
            success:true,
            message: "Beautician Account Applied Successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            success:false, error, message:"Error while applying for beautician"
        })
    }
}

exports.B_ProfileList=async(req,res)=>{
    try {
        const beauticians = await B_Profile.find({status: 'approved'})
        res.status(201).json({success:true, message:"Beautician List Fetched Successfully", data: beauticians})
    } catch (error) {
        console.log(error)
        res.status(500).json({error, success: false, message:'Error while getting Beauticians List'})
    }
}

exports.B_ProfileDetail=async(req,res)=>{
    try {
        const b_profile = await B_Profile.findOne({userId: req.body.userId})
        res.status(200).json({success:true, message:'Beautician data fetch success', data: b_profile})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error, message:'Error in Fetching Beauticians Details'})
    }
}

exports.B_ProfileUpdate=async(req,res)=>{
    try {
        const b_profile = await B_Profile.findOneAndUpdate(
            {userId: req.params.id},
            {
                beautician_name: req.body.beautician_name,
                beautician_bio: req.body.beautician_bio,
                experience: req.body.experience,
                gallery: req.body.gallery,
                pricing: req.body.pricing,
                services_offered: req.body.services_offered,
                working_hours: req.body.working_hours,
                certifications: req.body.certifications,
                contact_info: {
                    email: req.body.contact_info.email,
                    phoneNumber: req.body.contact_info.phoneNumber
                  },
                  socials: {
                    instragram: req.body.socials.instragram,
                    facebook: req.body.socials.facebook,
                    tiktok: req.body.socials.tiktok
                  }
                
            },{new:true}
        )
        res.status(201).json({success:true, message:'Beautician Profile Updated',data: b_profile})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Beautician Profile Update Issue', error})
    }
}
exports.B_ProfilePicUpdate=async(req,res)=>{
    try {
        const b_profile = await B_Profile.findOneAndUpdate(
            {userId: req.params.id},
            {
                beautician_profilepic: req.file.path,
            },{new:true}
        )
        res.status(201).json({success:true, message:'Beautician Profile Picture Updated',data: b_profile})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Beautician Profile Picture Update Issue', error})
    }
}
//get single beautician
exports.getBeauticianById = async(req,res) => {
    try {
        const b_profile = await B_Profile.findOne({_id:req.body.beauticianId})
        res.status(200).json({success:true, message:"Single Beautician Info Fetched", data: b_profile})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Error in Single Beautician Info Fetching",error})
    }
}

exports.beauticianAppointmentList = async(req,res) =>{
    try {
        const beautician = await B_Profile.findOne({userId:req.body.userId})
        const appointments = await Appointment.find({beauticianId: beautician._id})
        res.status(200).json({
            success:true,
            message:'Beautician Appointments Fetched Successfully',
            data:appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error, success:false, message:"Error while fetching Beauticians Appointment List"})
    }
}

exports.updateStatus = async(req,res)=>{
    try {
        const {appointmentId, status} = req.body
        const appointments = await Appointment.findByIdAndUpdate(appointmentId,{status})
        const user = await userModel.findOne({_id: appointments.userId})
        const notification = user.notification
        notification.push({
            type:'Appointment Status Updated',
            message:` Your appointment has been ${status}`,
            onClickPath: '/appointments'
        })
        await user.save()
        res.status(200).json({success:true, message:'Appointment Status Updated Successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error, success:false, message:"Error in Udate Status"})
    }
}

exports.B_ProfileDelete = (req,res)=>{
    B_Profile.findByIdAndDelete(req.params.id)
    .then(b_profile=>{
        if (!b_profile){
            return res.status(404).json({error:'b_profile with this id is not found'})
        }
        else{
            return res.status(200).json({message:'profile deleted'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}