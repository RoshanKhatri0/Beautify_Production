const express = require('express')
const authMware = require('../middleware/authMware')
const { getAllUsers, getAllBeauticians, changeAccountStatusCtrl } = require('../controllers/adminCtrl')
const router = express.Router()

router.get('/getAllUsers', authMware, getAllUsers )
router.get('/getAllBeauticians', authMware, getAllBeauticians )
router.post('/changeAccountStatus', authMware, changeAccountStatusCtrl)


module.exports = router