const listAdmin = require('../models/listAdminModels')
const bcrypt = require('bcrypt')
const path = require('path')
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
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
const { notify } = require('../routes')
cloudinary.config({
    cloud_name: 'dvhhz53rr',
    api_key: '272966692333936',
    api_secret: '0Tz28aal-cHCjr0K5bYF4V00XYo'
});

exports.login = async (req, res, next) => {
    res.render('account/login', {
        layout: ''
    });
}
exports.register = async (req, res, next) => {
    res.render('account/register', {
        layout: ''
    })
}
exports.postRegister = async (req, res, next) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    let admin = await listAdmin.getAdminByUsername(username)
    let available = true;
    if (admin) {
        showNotifBeforeLogin(res, "Error!!!", "An account with your username already exist!!!")
        available = false;
    }
    admin = await listAdmin.getAdminByEmail(email)
    if (admin) {
        showNotifBeforeLogin(res, "Error!!!", "An account with your email already exist!!!")
        available = false;
    }

    if (available) {
        let hashedPassword = await bcrypt.hash(password, 10);

        const token = jwt.sign({ email, username, hashedPassword }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '1m' })

        const emailData = {
            from: 'My Book Store Admin <noreply@mybookstore.com>',
            to: email,
            subject: 'Verify your account',
            html: `
                <h2>Please click on the link below to verify your account</h2>  
                <a href="${process.env.CLIENT_URL}verify-account/${token}">
                ${process.env.CLIENT_URL}verify-account/${token}</a>
                `
        }

        transporter.sendMail(emailData, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Email has been sent to ' + email)
            }
        })
        showNotifBeforeLogin(res, "Check your email!!!", "Please check your email to take activate link!!!")
    }
}
exports.verifyAccount = async (req, res, next) => {
    const token = req.params.token;
    if (token) {
        let email, username, hashedPassword
        let error
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function (err, decoded) {
            if (err) {
                showNotifBeforeLogin(res, "Error!!!", err)
                error = err
            } else {
                email = decoded.email
                username = decoded.username
                hashedPassword = decoded.hashedPassword
            }
        });
        if (!error) {
            const admin = await listAdmin.createAccount(username, hashedPassword, email)
            if (admin) {
                showNotifBeforeLogin(res, "Successfull!!!", "Create account successfully!!!")
            } else {
                showNotifBeforeLogin(res, "Error!!!", "Something went wrong when we try to create your account!!!")
            }
        }
    } else {
        showNotif(res, "Error!!!", 'Something wrong!!!');
    }
}
exports.forgotPassword = (req, res, next) => {
    res.render('account/forgotPassword', {
        layout: ''
    })
}
exports.postForgotPassword = async (req, res, next) => {
    const email = req.body.email
    const admin = await listAdmin.getAdminByEmail(email)
    if (admin) {
        const token = jwt.sign({ email }, process.env.JWT_RESET_PASS, { expiresIn: '1m' })

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
    if (token) {
        let email;
        jwt.verify(token, process.env.JWT_RESET_PASS, function (err, decoded) {
            if (err) {
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
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let avatar = req.user.avatar;
        if (files.avatar.size > 0) {
            const img = await cloudinary.uploader.upload(files.avatar.path);
            avatar = img.url;
        }
        const data = {
            firstName: fields.firstName,
            lastName: fields.lastName,
            more: fields.more,
            avatar: avatar
        }
        const admin = await listAdmin.updateOneAccount(req.user.id, data);
        if (admin) {
            res.redirect('/account-profile')
        } else {
            showNotif(res, "Error", "Sorry, some error happen while we trying to update your account!")
        }
    });
    // upload(req, res, async (err) => {
    //     if (err) {
    //         showNotif(res, "Error", err);
    //     } else {
    //         let avatar;
    //         //check if user has uploaded new avatar yet
    //         if (req.file !== undefined) {
    //             avatar = req.file.filename
    //         } else {
    //             avatar = null;
    //         }

    //         //fields contain data need to be updated
    //         const fields = {
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //             more: req.body.more,
    //             avatar: avatar
    //         }

    //         const admin = await listAdmin.updateOneAccount(req.user.id, fields)

    //         if (admin) {
    //             res.redirect('/account-profile')
    //         } else {
    //             showNotif(res, "Error", "Sorry, some error happen while we trying to update your account!")
    //         }
    //     }
    // })
}
exports.changePassword = (req, res, next) => {
    res.render('account/changePassword', {
        title: "Change Password"
    })
}
exports.postChangePassword = async (req, res, next) => {
    const isValid = await bcrypt.compare(req.body.password, req.user.password)
    if (isValid) {
        const newPassword = req.body.newPassword[0]
        listAdmin.changePasswordByUsername(req.user.username, newPassword)
        showNotif(res, "Successfully", "Your password has been changed!!!")
    } else {
        showNotif(res, "Error", "Your password is incorrect!!!")
    }
}
exports.admins = async (req, res, next) => {
    const admins = await listAdmin.getListAdmin()
    res.render('account/admins', {
        admins,
        title: 'Admins Account'
    });
}
exports.changeIsActive = async (req, res, next) => {
    const id = req.body.id
    if (id == req.user._id) {
        showNotif(res, "Error!!!", "You can not blocked your own account!!!")
    } else {
        const isActive = req.body.isActive
        const admin = await listAdmin.changeIsActive(id, isActive)
        if (admin) {
            res.redirect('/admins')
        } else {
            showNotif(res, "Error!!!", "Something went wrong!!!")
        }
    }
}

function showNotif(res, myNotifTitle, myNotifText) {
    res.render('account/notif', {
        notifTitle: myNotifTitle,
        notifText: myNotifText,
        title: 'Alert'
    });
}

function showNotifBeforeLogin(res, messageTitle, message) {
    res.render('account/register', {
        layout: '',
        messageTitle: messageTitle,
        message: message
    })
}