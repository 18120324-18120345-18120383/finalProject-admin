const books = require('../models/listBookModels')
const admins = require('../models/listAdminModels')
const users = require('../models/listUserModels')
const bcrypt = require('bcrypt')

exports.authenPassword = async (req, res, next) => {
    const isValidPass = await bcrypt.compare(req.query.password, req.user.password)
    res.send(isValidPass)
}

exports.allBooks = async (req, res, next) => {
    const listBook = await books.listBook();
    res.json(listBook)
}
exports.findBooksByCategory = async (req, res, next) => {
    const listBook = await books.findBooksByCategory(req.query.category);
    res.json(listBook)
}