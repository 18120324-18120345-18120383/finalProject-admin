const Admin = require('../models/listAdmin')

exports.index = (req, res, next) => {
    res.render('login', {loginErrVisibility: "hidden"});
}
exports.checkLoginValid = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    Admin.findOne({username: username, password: password})
    .then((result) => {
        console.log(result);
        console.log("go to table");
        if (result != null){
            res.render('index')
        }
        else{
            res.render('login', {loginErrVisibility: "visible"});
        }
    })
    .catch((err) => {
        console.log(err);
    })
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