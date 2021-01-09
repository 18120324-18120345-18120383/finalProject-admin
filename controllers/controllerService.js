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

    const filter = req.query.filter

    const listBook = await books.listBook(filter);

    console.log("[api] Load books successfully!")

    res.json(listBook)
}
exports.allUsers = async (req, res, next) => {
    const filter = req.query.filter

    const listUser = await users.getListAccount(filter);
    res.json(listUser)
}
exports.findCoverById = async (req, res, next) => {
    const id = req.query.id;

    const book = await books.getOneBook(id)

    const coversString = book.coversString;
    const coverTypes = book.coverTypes;

    res.json({coversString, coverTypes})
}
exports.checkExistUsername = async (req, res, next) => {
    const username = req.query.username;

    const admin = await admins.getAdminByUsername(username)

    if (admin){
        res.send(true);
    } else {
        res.send(false);
    }
}
exports.checkExistEmail = async (req, res, next) => {
    const email = req.query.email;

    const admin = await admins.getAdminByEmail(email)

    if (admin){
        res.send(true);
    } else {
        res.send(false);
    }
}