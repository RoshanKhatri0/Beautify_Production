const {check,validationResult} = require('express-validator')

exports.userValidation=[
    check('name','Name is required').notEmpty()
    .isLength({min:3}).withMessage('Name must be atleast 3 characters'),
    check('email','Email is required').notEmpty()
    .isEmail().withMessage('Email format incorrect'),
]

exports.passwordValidation=[
    check('password','password is mandatory').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain one lowercase character')
    .matches(/[A-Z]/).withMessage('password must contain one uppercase character')
    .matches(/[0-9]/).withMessage('password must contain one numeric character')
    .matches(/[@#$_?!]/).withMessage('password must contain special character')
    .isLength({min:8}).withMessage('password must be of minimun 8 characters')
    .isStrongPassword().withMessage('Enter Stronger Password')
]

exports.validation=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({message:errors.array()[0].msg})
    }
}