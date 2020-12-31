const books = require('../models/listBookModels')
const admins = require('../models/listAdminModels')
const users = require('../models/listUserModels')
const bcrypt = require('bcrypt')

exports.authenPassword = async (req, res, next) => {
    const isValidPass = await bcrypt.compare(req.query.password, req.user.password)
    res.send(isValidPass)
}

exports.allBooks = async (req, res, next) => {
    console.log("[api] Loading books...")

    const listBook = await books.listBook();

    console.log("[api] Load books successfully!")

    res.json(listBook)
}
exports.allUsers = async (req, res, next) => {
    const listUser = await users.getListAccount();
    res.json(listUser)
}