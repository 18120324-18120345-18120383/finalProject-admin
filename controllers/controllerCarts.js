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
exports.statByDay = async (req, res, next) => {
    let carts = await listCarts.findCart({status: 1})
    carts = carts.concat(await listCarts.findCart({status: 2}))
    let days = []
    carts.forEach(cart => {

        let orderDate = cart.orderDate.getDate() + ' - '
        orderDate += (cart.orderDate.getMonth() + 1) + ' - '
        orderDate += cart.orderDate.getFullYear()

        let index = days.findIndex((day) => day.orderDate === orderDate)
        if (index != -1){
            days[index].totalIncome += cart.total;
        } else {
            let newDay = {
                totalIncome: cart.total,
                orderDate: orderDate
            }
            days.push(newDay)
        }
    });
    res.render('carts/stat', {
        title: "Stat By Day",
        days
    })
}
exports.statByMonth = async (req, res, next) => {
    let carts = await listCarts.findCart({status: 1})
    carts = carts.concat(await listCarts.findCart({status: 2}))
    let months = []
    carts.forEach(cart => {
        let orderDate = (cart.orderDate.getMonth() + 1) + ' - '
        orderDate += cart.orderDate.getFullYear()

        let index = months.findIndex((month) => month.orderDate === orderDate)
        if (index != -1){
            months[index].totalIncome += cart.total;
        } else {
            let newMonth = {
                totalIncome: cart.total,
                orderDate: orderDate
            }
            months.push(newMonth)
        }
    });

    res.render('carts/stat', {
        title: "Stat By Month",
        months
    })
}
exports.statByYear = async (req, res, next) => {
    let carts = await listCarts.findCart({status: 1})
    carts = carts.concat(await listCarts.findCart({status: 2}))
    let years = []
    carts.forEach(cart => {
        let orderDate = cart.orderDate.getFullYear()

        let index = years.findIndex((year) => year.orderDate === orderDate)
        if (index != -1){
            years[index].totalIncome += cart.total;
        } else {
            let newYear = {
                totalIncome: cart.total,
                orderDate: orderDate
            }
            years.push(newYear)
        }
    });
    res.render('carts/stat', {
        title: "Stat By Year",
        years
    })
}
exports.statByQuarter = async (req, res, next) => {
    let carts = await listCarts.findCart({status: 1})
    carts = carts.concat(await listCarts.findCart({status: 2}))
    const quarters = []
    carts.forEach(cart => {
        let orderDate = monthToQuarter(cart.orderDate.getMonth()) + ' - '
        orderDate += cart.orderDate.getFullYear()

        let index = quarters.findIndex((quarter) => quarter.orderDate === orderDate)
        if (index != -1){
            quarters[index].totalIncome += cart.total;
        } else {
            let newQuarter = {
                totalIncome: cart.total,
                orderDate: orderDate
            }
            quarters.push(newQuarter)
        }
    });
    res.render('carts/stat', {
        title: "Stat By Quarter",
        quarters
    })
}
function monthToQuarter(month){
    if (month < 3) {
        return 'I'
    } else if (month < 6) {
        return 'II'
    } else if (month < 9) {
        return 'III'
    } else {
        return 'IV'
    }
}