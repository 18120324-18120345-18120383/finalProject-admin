const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: String,
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  coversString: String,
  coverTypes: String,
  description: String
})

const cartSchema = new mongoose.Schema({
  status: Number,
  total: Number,
  orderDate: Date,
  finishedDate: Date,
  quantity: Number,
  fullAddress: String,
  products: [productSchema]
})
const Cart = mongoose.model('carts', cartSchema);

module.exports.findCart = async (filter = null) => {
  const carts = await Cart.find(filter)
  return carts;
}

module.exports.findProductsByCart = async (filter) => {
  const cart = (await Cart.find(filter))[0]
  const products = cart.products
  return products;
}

module.exports.updateCart = async (filter, update) => {
  const carts = await Cart.findOneAndUpdate(filter, update)
  return carts;
}