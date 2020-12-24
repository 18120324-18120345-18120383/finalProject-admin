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

exports.login = async (req, res, next) => {
    res.render('account/login', {layout: ''});
}
exports.loginErr = (req, res, next) => {
    res.render('account/login', {
        err: "Username or password is incorrect!!!",
        layout: ''
    })
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