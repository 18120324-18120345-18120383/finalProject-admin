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
            cart.products.forEach(product => {
                let size = days[index].products.length
                let i = 0
                for (; i < size; i++){
                    if (days[index].products[i].productID.localeCompare(product.productID) == 0){
                        days[index].products[i].quantity += product.quantity
                        days[index].products[i].total += product.total
                        break;
                    }
                }
                if (i == size) { //product not exist in days[index].products
                    days[index].products.push(product)
                }
            })
        } else {
            let newDay = {
                totalIncome: cart.total,
                orderDate: orderDate,
                products: cart.products
            }
            days.push(newDay)
        }
    });

    days.forEach(day => {
        day.products.sort((p1, p2) => {
            return (p1.quantity - p2.quantity)
        })
        day.products.reverse()

        let count = day.products.length
        while (count > 10){
            day.products.pop()
            count--;
        }
    })

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

        let index = months.findIndex((month) => month.orderDate.localeCompare(orderDate) == 0)
        if (index != -1){
            months[index].totalIncome += cart.total;
            cart.products.forEach(product => {
                let size = months[index].products.length
                let i = 0
                for (; i < size; i++){
                    if (months[index].products[i].productID.localeCompare(product.productID) == 0){
                        months[index].products[i].quantity += product.quantity
                        months[index].products[i].total += product.total
                        break;
                    }
                }
                if (i == size) { //product not exist in months[index].products
                    months[index].products.push(product)
                }
            })
        } else {
            let newMonth = {
                totalIncome: cart.total,
                orderDate: orderDate,
                products: cart.products
            }
            months.push(newMonth)
        }
    });

    months.forEach(month => {
        month.products.sort((p1, p2) => {
            return (p1.quantity - p2.quantity)
        })
        month.products.reverse()

        let count = month.products.length
        while (count > 10){
            month.products.pop()
            count--;
        }
    })

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
            cart.products.forEach(product => {
                let size = years[index].products.length
                let i = 0
                for (; i < size; i++){
                    if (years[index].products[i].productID.localeCompare(product.productID) == 0){
                        years[index].products[i].quantity += product.quantity
                        years[index].products[i].total += product.total
                        break;
                    }
                }
                if (i == size) { //product not exist in years[index].products
                    years[index].products.push(product)
                }
            })
        } else {
            let newYear = {
                totalIncome: cart.total,
                orderDate: orderDate,
                products: cart.products
            }
            years.push(newYear)
        }
    });

    years.forEach(year => {
        year.products.sort((p1, p2) => {
            return (p1.quantity - p2.quantity)
        })
        year.products.reverse()

        let count = year.products.length
        while (count > 10){
            year.products.pop()
            count--;
        }
    })

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
            cart.products.forEach(product => {
                let size = quarters[index].products.length
                let i = 0
                for (; i < size; i++){
                    if (quarters[index].products[i].productID.localeCompare(product.productID) == 0){
                        quarters[index].products[i].quantity += product.quantity
                        quarters[index].products[i].total += product.total
                        break;
                    }
                }
                if (i == size) { //product not exist in quarters[index].products
                    quarters[index].products.push(product)
                }
            })
        } else {
            let newQuarter = {
                totalIncome: cart.total,
                orderDate: orderDate,
                products: cart.products
            }
            quarters.push(newQuarter)
        }
    });

    quarters.forEach(quarter => {
        quarter.products.sort((p1, p2) => {
            return (p1.quantity - p2.quantity)
        })
        quarter.products.reverse()

        let count = quarter.products.length
        while (count > 10){
            quarter.products.pop()
            count--;
        }
    })

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
exports.viewTop10 = async (req, res, next) => {
    console.log(req.body)
    let productID = req.body.productID
    let name = req.body.name
    let quantity = req.body.quantity
    let total = req.body.total
    const orderDate = req.body.orderDate
    let size = productID.length
    let products = []
    for (let i = 0; i < size; i++) {
        let product = {
            productID: productID[i],
            name: name[i],
            quantity: quantity[i],
            total: total[i]
        }
        products.push(product)
    }

    res.render('carts/top-10', {
        title: "Top 10 Best Seller",
        orderDate,
        products
    })
}