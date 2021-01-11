const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name : String,
    coversString: [String],
    coverTypes: [String],
    category: String,
    categoryID: ObjectID,
    basePrice: Number,
    description: String,
    views: Number,
    buyCount: Number
})

const Book = mongoose.model('books', bookSchema);

module.exports.deleteOneBook = async (id) => {
    const result = await Book.findByIdAndRemove(id);
    return result;
}

module.exports.addOneBook = async (book) => {
    const result = await Book.insertMany([book]);
    return result;
}

module.exports.updateBook = async (filter, update) => {
    const book = await Book.findOneAndUpdate(filter, update);
    return book;
} 

module.exports.listBook = async (filter = null) => {
    const books = await Book.find(filter, {
        coverTypes: 0,
        coversString: 0
    });
    return books;
}

module.exports.getOneBook = async (id) => {
    const book = await Book.findById(id);
    return book;
}

module.exports.searchBook = async (nameBook) => {
    const books = await Book.find({name : { "$regex": nameBook, "$options": "i" }}).exec();
    return books;
}

module.exports.findBooksByCategory = async (category) => {
    const books = await Book.find({category: category}).exec();
    return books;
}