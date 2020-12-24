const listAdmin = require('../models/listAdminModels')
const bcrypt = require('bcrypt')

const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: './public/img/adminAvatar',
    filename: (req, file, callback) => {
        callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000} //size of image must under 2000000 byte (2MB)
}).single('avatar')

require("dotenv").config();
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')

exports.login = async (req, res, next) => {
    res.render('account/login', {layout: ''});
}
exports.loginErr = (req, res, next) => {
    res.render('account/login', {
        err: "Username or password is incorrect!!!",
        layout: ''
    })
}
exports.forgotPassword = (req, res, next) => {
    res.render('account/forgotPassword', {
        layout: ''
    })
}
exports.postForgotPassword = async (req, res, next) => {
    const email = req.body.email
    const admin = await listAdmin.getAdminByEmail(email)
    if (admin){
        const token = jwt.sign({email}, process.env.JWT_RESET_PASS, {expiresIn: '1m'})

        const emailData = {
            from: 'My Book Store Admin <noreply@mybookstore.com>',
            to: email,
            subject: 'Reset your password',
            html: `
            <h2>Please click on the link below to reset your password</h2>  
            <a href="${process.env.CLIENT_URL}reset-password/${token}">
            ${process.env.CLIENT_URL}reset-password/${token}</a>
            `
        }

        transporter.sendMail(emailData, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Email has been sent to ' + email)
            }
        })

        res.render('account/forgotPassword', {
            layout: '',
            messageTitle: "Check your email",
            message: "Please check your email to take reset password link!!!"
        })
    } else {
        res.render('account/forgotPassword', {
            layout: '',
            messageTitle: "Error",
            message: "Do not exist an account with your email!!!"
        })
    }
}
exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    if (token){
        let email;
        jwt.verify(token, process.env.JWT_RESET_PASS, function(err, decoded) {
            if (err){
                res.render('account/forgotPassword', {
                    layout: '',
                    messageTitle: "Error",
                    message: err
                })
            } else {
                email = decoded.email
            }
          });
        const newPassword = randomstring.generate(10)
        const admin = await listAdmin.changePasswordByEmail(email, newPassword)
        res.render('account/forgotPassword', {
            layout: '',
            messageTitle: "Reset password successfully!!!",
            message: "Your username is " + admin.username + "; Your new password is: " + newPassword 
        })
    } else {
        showNotif(res, "Error!!!", 'Something wrong!!!');
    }
}
exports.getProfile = (req, res, next) => {
    const admin = req.user;
    res.render('account/profile', {
        admin,
        title: 'Account Profile'
    })
}
exports.postProfile = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err){
            showNotif(res, "Error", err);
        } else {
            let avatar;
            //check if user has uploaded new avatar yet
            if (req.file !== undefined){
                avatar = req.file.filename
            } else {
                avatar = null;
            }
            
            //fields contain data need to be updated
            const fields = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                more: req.body.more,
                avatar: avatar
            }

            const admin = await listAdmin.updateOneAccount(req.user.id, fields)

            if (admin) {
                res.redirect('/account-profile')
            } else {
                showNotif(res, "Error", "Sorry, some error happen while we trying to update your account!")
            }
        }
    })
}
exports.changePassword = (req, res, next) => {
    res.render('account/changePassword', {
        title: "Change Password"
    })
}
exports.postChangePassword = async (req, res, next) => {

    //compare current password to password that user type
    const validPass = await bcrypt.compare(req.body.password, req.user.password)

    if (!validPass){
        showNotif(res, "Error", "Your password is incorrect!!!")
    } else {
        const newPassword = req.body.newPassword[0]
        listAdmin.changePasswordByUsername(req.user.username, newPassword)
        showNotif(res, "Successfully", "Your password has been changed!!!")
    }
}

function showNotif(res, myNotifTitle, myNotifText) {
    res.render('account/notif', {
        notifTitle: myNotifTitle,
        notifText: myNotifText,
        title: 'Alert'
    });
}