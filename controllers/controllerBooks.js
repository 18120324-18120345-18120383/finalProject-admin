const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const Book = require('../models/listBookModels')
const Category = require('../models/listCategoryModels')

exports.index = (req, res, next) => {
    res.render('index', {
        title: "Dashboard"
    });
}
exports.books = async (req, res, next) => {
    console.log("Loading books...")

    let books = await Book.listBook();
   
    console.log("Load books successfully!")

    console.log("Loading categories")

    let listCategory = await Category.findCategories();
    let categories = []
    listCategory.forEach(category => {
        categories.push(category.name)
    });
    console.log(categories)

    console.log("Load categories successfully!")

    res.render('books', {
        books,
        categories,
        title: "Books"
    });
}
exports.addBook = async (req, res, next) => {
    const name = req.body.name;
    const category = req.body.category;
    const coversEncoded = [req.body.cover1, req.body.cover2, req.body.cover3];
    const basePrice = req.body.basePrice;
    const description = req.body.description;

    let tempFilter = {name: category}
    categoryID = Category.findCategories(tempFilter)._id

    const book = {
        name: name,
        category: category,
        categoryID: categoryID,
        basePrice: basePrice,
        description: description
    };

    let temp = saveCovers(coversEncoded)

    if (temp) {
        book.coverTypes = temp.coverTypes;
        book.coversString = temp.coversString;
    }

    try {
        await Book.addOneBook(book);
        await Category.addOneBookToCategory(tempFilter);
        res.redirect('/books');
    }
    catch (err) {
        console.log(err);
    }
}
const saveCovers = (coversEncoded) => {
    let coverTypes = []
    let coversString = []
    coversEncoded.forEach(coverEncoded => {
        if (!coverEncoded) {
            coverTypes.push(null)
            coversString.push(null)
            return;
        }

        const coverJSON = JSON.parse(coverEncoded)
        if (coverJSON != null) {
            let coverString = coverJSON.data;
            let coverType = coverJSON.type;
            coverTypes.push(coverType)
            coversString.push(coverString)
        }
    });
    return {
        coverTypes,
        coversString
    }
}
exports.updateBook = async (req, res, next) => {
    const id = req.body.id;
    const name = req.body.newName;
    const category = req.body.newCategory;
    const coversEncoded = [req.body.newCover1, req.body.newCover2, req.body.newCover3];
    const basePrice = req.body.newBasePrice;
    const description = req.body.newDescription;

    const filter = { _id: id };

    let tempFilter = {name: category}
    categoryID = Category.findCategories(tempFilter)._id


    let update = {
        name: name,
        category: category,
        categoryID: categoryID,
        basePrice: basePrice,
        description: description
    };

    let temp = saveCovers(coversEncoded)

    if (temp) {
        const book = await Book.getOneBook(id)
        update.coversString = []
        update.coverTypes = []
        for (let i = 0; i < 3; i++){
            if (!temp.coversString[i]){
                update.coversString.push(book.coversString[i])
                update.coverTypes.push(book.coverTypes[i])
            } else {
                update.coversString.push(temp.coversString[i])
                update.coverTypes.push(temp.coverTypes[i])
            }
        }
    }

    try {
        await Book.updateBook(filter, update);
        res.redirect('/books');
    }
    catch (err) {
        console.log(err);
    }

}
exports.deleteBook = (req, res, next) => {
    const id = req.body.id;
    try {
        Book.deleteOneBook(id);
        res.redirect('/books');
    }
    catch (err) {
        console.log(err);
    }
}