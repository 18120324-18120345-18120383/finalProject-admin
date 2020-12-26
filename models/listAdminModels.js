const { ObjectID, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const bcrybt = require('bcrypt')
const fs = require('fs')

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username : String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    avatar: String,
    level: String,
    more: String
})

const Admin = mongoose.model('admins', adminSchema);

module.exports.getAdminByID = async (id) =>{
    const admin = Admin.findById(id);
    return admin;
}
module.exports.authenticateAdmin = async (username, password) => {
    let admin;
    if (username.indexOf('@') != -1){
        admin = await Admin.findOne({email: username}).exec();
    } else {
        admin = await Admin.findOne({username: username}).exec();
    }

    if (admin == null) {
        return "An account with your username or email does not exist!!!";
    }
    let flag = await bcrybt.compare(password, admin.password);
    if (!flag) {
        return "Your password is incorrect!!!";
    }
    return admin;
}
module.exports.createAccount = async(username, hashedPassword, email) => {
    const admin = await Admin.insertMany({
        username: username,
        password: hashedPassword,
        email: email
    })
    console.log("create account success!!!")
    return admin;
}
module.exports.updateOneAccount = async (id, fields) => {
    const filter = {_id: id};
    
    let update = {
        firstName: fields.firstName, 
        lastName: fields.lastName,
        more: fields.more,
        avatar: '/img/adminAvatar/' + fields.avatar
    };
    if (fields.avatar === null) {
        update = {
            firstName: fields.firstName, 
            lastName: fields.lastName, 
            more: fields.more,
            more: fields.more
        }
    } else {
        //delete current avatar before update new avatar
        const currentAva = (await Admin.findOne(filter)).avatar 
        try { 
            fs.unlinkSync('./public' + currentAva)
            console.log("delete file successfully!!!")
        } catch (err){
            console.log(err)
        }
    }
    const admin = await Admin.findOneAndUpdate(filter, update);
    return admin;
}
module.exports.changePasswordByUsername = async (username, newPassword) =>{
    const filter = {username: username};

    const hashedPassword = await bcrybt.hash(newPassword, 10)

    let update = {
        password: hashedPassword
    };

    const admin = await Admin.findOneAndUpdate(filter, update);
    return admin;
}
module.exports.getAdminByEmail = async (email) => {
    const admin = await Admin.findOne({email: email}).exec();
    return admin
}
module.exports.changePasswordByEmail = async (email, newPassword) =>{
    const filter = {email: email};

    const hashedPassword = await bcrybt.hash(newPassword, 10)

    let update = {
        password: hashedPassword
    };

    const admin = await Admin.findOneAndUpdate(filter, update);
    return admin;
}