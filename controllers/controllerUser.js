const listUser = require('../models/listUserModels')

const path = require('path')

exports.index = async (req, res, next) => {
    const users = await listUser.getListAccount()
    res.render('users-account/users', {
        users,
        title: 'Users Account'
    });
}
exports.updateUserAccount = async (req, res, next) => {
    const isActive = (req.body.isActive == "true")
    const id = req.body.id
    const user = await listUser.changeIsActiveById(id, isActive)
    res.redirect('/users-account')
}