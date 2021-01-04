const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema ({
    name: String,
    numberOfBook: Number
})

const Categories = mongoose.model('Categories', categorySchema);
module.exports.categories = async () => {
    const categories = await Categories.find()
    return categories;
}

module.exports.getIDByName = async (name) => {
  const category = await Categories.findOne({name: name});
  return category._id;
}