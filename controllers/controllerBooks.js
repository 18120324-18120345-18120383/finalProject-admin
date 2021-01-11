const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const formidable = require('formidable');
const fs = require('fs')
const cloudinary = require('cloudinary').v2;

const Book = require('../models/listBookModels')
const Category = require('../models/listCategoryModels')

cloudinary.config({
    cloud_name: 'dvhhz53rr',
    api_key: '272966692333936',
    api_secret: '0Tz28aal-cHCjr0K5bYF4V00XYo'
});
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

    console.log("Load categories successfully!")

    res.render('books', {
        books,
        categories,
        title: "Books"
    });
}
exports.addBook = async (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let image = [];
        const img1 = await cloudinary.uploader.upload(files.cover1.path);
        const img2 = await cloudinary.uploader.upload(files.cover2.path);
        const img3 = await cloudinary.uploader.upload(files.cover3.path);
        image.push(img1.url);
        image.push(img2.url);
        image.push(img3.url);
        let tempFilter = { name: fields.category }
        let categoryID = (await Category.findCategories(tempFilter))[0]._id
        const book = {
            name: fields.name,
            basePrice: fields.basePrice,
            description: fields.description,
            categoryID: categoryID,
            category: fields.category,
            coversString: image
        };
        try {
            await Book.addOneBook(book);
            await Category.updateNumberOfBookInCategory(tempFilter, 1);
            res.redirect('/books');
        }
        catch (err) {
            console.log(err);
        }
    });
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
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const book = await Book.getOneBook(fields.id)
        let image = [book.coversString[0], book.coversString[1], book.coversString[2]];
        console.log(image);
        if (fields.newCover1) {
            const img = await cloudinary.uploader.upload(fields.newCover1.path);
            image[0] = img;
        }
        if (fields.newCover2) {
            const img = await cloudinary.uploader.upload(files.newCover2.path);
            image[1] = img;
        }
        if (fields.newCover3) {
            const img = await cloudinary.uploader.upload(files.newCover3.path);
            image[2] = img;
        }
        const filter = { _id: fields.id };
        let tempFilter = { name: fields.newCategory };
        console.log(tempFilter);
        const categoryID = (await Category.findCategories(tempFilter))[0]._id
        let update = {
            name: fields.newName,
            category: fields.newCategory,
            categoryID: categoryID,
            basePrice: fields.newBasePrice,
            description: fields.newDescription,
            coversString: image
        };

        if (book.category != fields.category) {
            //decrease number of book in current category
            tempFilter = { name: book.category }
            await Category.updateNumberOfBookInCategory(tempFilter, -1);

            //increase number of book in new category
            tempFilter = { name: fields.category }
            await Category.updateNumberOfBookInCategory(tempFilter, 1);
        }

        try {
            await Book.updateBook(filter, update);
            res.redirect('/books');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteBook = async (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const id = fields.id;
        try {
            //decrease number of book in category
            let book = await Book.getOneBook(id)
            let tempFilter = { name: book.category }
            await Category.updateNumberOfBookInCategory(tempFilter, -1);

            //delete book
            await Book.deleteOneBook(id);
            res.redirect('/books');
        }
        catch (err) {
            console.log(err);
        }
    });
}