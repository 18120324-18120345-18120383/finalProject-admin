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

module.exports.addOneBookToCategory = async (filter) => {
    //find the category of the book
    let category = await Categories.find(filter)

    if (category) {
        //increase number of books
        let newNumOfBooks = category[0].numberOfBook + 1;
        
        //update number of books
        const update = { numberOfBook: newNumOfBooks }
        category = await Categories.findOneAndUpdate(filter, update)
    }

    return category
}
