const listCarts = require('../models/listCartModel')

const path = require('path')

exports.unpaid = async (req, res, next) => {
    const filter = {status: 0}
    const carts = await listCarts.findCart(filter);
    res.render('carts/carts', {
        typeOfCarts: "List of unpaid carts",
        carts,
        title: 'Unpaid carts'
    });
}
exports.delivering = async (req, res, next) => {
    const filter = {status: 1}
    const carts = await listCarts.findCart(filter);
    res.render('carts/carts', {
        typeOfCarts: "List of delivering carts",
        carts,
        title: 'Delivering carts'
    });
}
exports.finished = async (req, res, next) => {
    const filter = {status: 2}
    const carts = await listCarts.findCart(filter);
    res.render('carts/carts', {
        typeOfCarts: "List of finished carts",
        carts,
        title: 'Finished carts'
    });
}