const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,
    numberOfBook: Number
})

const Categories = mongoose.model('Categories', categorySchema);

module.exports.findCategories = async (filter = null) => {
    const categories = await Categories.find(filter)
    return categories;
}

module.exports.updateNumberOfBookInCategory = async (filter, changeNumber) => {
    //find the category of the book
    let category = await Categories.findOne(filter)

    if (category) {
        //increase number of books
        let newNumOfBooks = category.numberOfBook + changeNumber;
        
        //update number of books
        const update = { numberOfBook: newNumOfBooks }
        category = await Categories.findOneAndUpdate(filter, update)
    }

    return category
}