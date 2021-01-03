const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: String,
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  cover: String,
  description: String
})

const cartSchema = new mongoose.Schema({
  status: Number,
  total: Number,
  orderDate: String,
  quantity: Number,
  fullAddress: String,
  products: [productSchema]
})
const Cart = mongoose.model('carts', cartSchema);

module.exports.findCart = async (filter = null) => {
  const carts = await Cart.find(filter)
  return carts;
}
