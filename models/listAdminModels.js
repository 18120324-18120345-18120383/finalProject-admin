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
    level: Number,
    isActive: Boolean,
    more: String
})

const Admin = mongoose.model('admins', adminSchema);

module.exports.getListAdmin = async () => {
    const admins = Admin.find();
    return admins;
}
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

    if (admin.isActive == false) {
        return "Your account is blocked!!!";
    }
    return admin;
}
module.exports.createAccount = async(username, hashedPassword, email) => {
    const admin = await Admin.insertMany({
        username: username,
        password: hashedPassword,
        email: email,
        level: 2,
        isActive: false
    })
    return admin;
}
module.exports.updateOneAccount = async (id, fields) => {
    const filter = {_id: id};
    
    let update = {
        firstName: fields.firstName, 
        lastName: fields.lastName,
        more: fields.more,
        avatar: fields.avatar
    };
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
module.exports.getAdminByUsername = async (username) => {
    const admin = await Admin.findOne({username: username}).exec();
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
module.exports.getLevelById = async(id) => {
    const admin = await Admin.findOne({_id: id}).exec();
    return admin.level;
}
module.exports.changeIsActive = async(id, isActive) => {
    let filter = {
        _id: id
    }
    let update = {
        isActive: isActive
    }
    const admin = await Admin.findOneAndUpdate(filter, update);
    return admin;
}