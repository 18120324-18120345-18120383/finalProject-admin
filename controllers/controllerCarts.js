const listCarts = require('../models/listCartModel')

const path = require('path')

exports.unpaid = async (req, res, next) => {
    const filter = {status: 0}
    const carts = await listCarts.findCart(filter);
    res.render('carts/carts', {
        typeOfCarts: "List of unpaid carts",
        finished: false,
        delivering: false,
        carts,
        title: 'Unpaid carts'
    });
}
exports.delivering = async (req, res, next) => {
    const filter = {status: 1}
    const carts = await listCarts.findCart(filter);
    res.render('carts/carts', {
        typeOfCarts: "List of delivering carts",
        finished: false,
        delivering: true,
        carts,
        title: 'Delivering carts'
    });
}
exports.finished = async (req, res, next) => {
    const filter = {status: 2}
    const carts = await listCarts.findCart(filter);
    res.render('carts/carts', {
        typeOfCarts: "List of finished carts",
        finished: true,
        delivering: false,
        carts,
        title: 'Finished carts'
    });
}
exports.detail = async (req, res, next) => {
    const filter = { _id: req.query.id };
    const cart = (await listCarts.findCart(filter))[0];
    const products = await listCarts.findProductsByCart(filter);
    res.render('carts/cart-detail', {
        cart,
        products,
        title: "Card detail"
    })
}
exports.finishCart = async (req, res, next) => {
    const filter = {_id: req.body.id}
    const currentDate = new Date()
    const update = {
        status: 2,
        finishedDate: currentDate
    }
    let cart = await listCarts.updateCart(filter, update)
    if (cart) {
        res.redirect('/carts/delivering')
    }
}