const express = require('express')
const { postUser, signIn, authController, getAllNotificationController, deleteAllNotification, bookAppointment, userAppointmentList } = require('../controllers/userController')
const authMware = require('../middleware/authMware')
const { userValidation, validation, passwordValidation } = require('../validator/validator')
const router = express.Router()

router.post('/register', userValidation , passwordValidation , validation , postUser)
router.post('/login', signIn)
router.post('/getUserData',authMware, authController)
router.post('/get-all-notification',authMware, getAllNotificationController)
router.post('/delete-all-notification',authMware, deleteAllNotification)
//Book appointment
router.post('/book-appointment',authMware, bookAppointment)
// Appointment List
router.get('/user-appointments',authMware, userAppointmentList)


module.exports=router