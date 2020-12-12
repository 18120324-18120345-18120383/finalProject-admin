const Admin = require('../models/listAdmin')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

exports.index = (req, res, next) => {
    res.render('login');
}

//add new admin
exports.addAdmin = (req, res, next) => {
    const admin = new Admin({
        username: "admin",
        password: "123456"
    });
    admin.save()
    .then((result) => {
        console.log('save admin success!');
        res.redirect('/tables');
    })
    .catch((err) => {
        console.log(err);
    });
}