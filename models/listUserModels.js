const { ObjectID, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const fs = require('fs')


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    firstName : String,
    lastName: String,
    avatar: String,
    email: String,
    phoneNumber: String,
    more: String,
    cartID: String,
    isActive: Boolean
})

const User = mongoose.model('list-users', userSchema);

module.exports.getListAccount = async () => {
    const users = await User.find({});
    return users;
}
module.exports.changeIsActiveById = async (id, isActive) =>{
    const filter = {_id: id};
    let update = {
        isActive: isActive
    };

    const user = await User.findOneAndUpdate(filter, update);
    return user;
}
module.exports.getUserByEmail = async (email) => {
    const user = await User.findOne({email: email}).exec();
    return user
}