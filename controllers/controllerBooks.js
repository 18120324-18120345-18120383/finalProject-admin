const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const Book = require('../models/listBookModels')

exports.index = (req, res, next) => {
    res.render('index', {
        title: "Dashboard"
    });
}
exports.books = async (req, res, next) => {
    let books = await Book.listBook();
    let categories = await Book.listCategory();

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

    let temp = saveCovers(coversEncoded)

    let categoryID
    switch (category) {
        case 'Art':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b4');
            break;
        case 'Autobiography':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b5');
            break;
        case 'Biography':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b6');
            break;
        case 'Chick Lit':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b7');
            break;
        case 'Comming-Of-Age':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b8');
            break;
        case 'Anthology':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b9');
            break;
        case 'Drama':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7ba');
            break;
        case 'Crime':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bb');
            break;
        case 'Dictionary':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bc');
            break;
        case 'Health':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bd');
            break;
        case 'History':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7be');
            break;
        case 'Hornor':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bf');
            break;
        case 'Poetry':
            categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7c0');
            break;
        default:
    }

    const book = {
        name: name,
        covers: temp.covers,
        coverTypes: temp.coverTypes,
        category: category,
        categoryID: categoryID,
        basePrice: basePrice,
        description: description
    };
    try {
        Book.addOneBook(book);
        res.redirect('/books');
    }
    catch (err) {
        console.log(err);
    }
}
const saveCovers = (coversEncoded) => {
    let covers = []
    let coverTypes = []
    coversEncoded.forEach(coverEncoded => {
        if (!coverEncoded) return false;

        const coverJSON = JSON.parse(coverEncoded)
        if (coverJSON != null) {
            let cover = new Buffer.from(coverJSON.data, 'base64');
            let coverType = coverJSON.type;
            covers.push(cover)
            coverTypes.push(coverType)
        } 
    });
    return {
        covers,
        coverTypes
    }
}
exports.updateBook = async (req, res, next) => {
    // const id = req.body.id;
    // const categoryID = req.body.categoryID;
    // const name = req.body.newName;
    // const category = req.body.newCategory;
    // const cover = [req.body.newCover1, req.body.newCover2, req.body.newCover3];
    // const basePrice = req.body.newBasePrice;
    // const description = req.body.newDescription;

    const form = formidable({ multiples: true });
    let cover = [];
    form.parse(req, (err, fields, files) => {
        const filter = { _id: fields.id };
        let categoryID;
        switch (fields.newCategory) {
            case 'Art':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b4');
                break;
            case 'Autobiography':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b5');
                break;
            case 'Biography':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b6');
                break;
            case 'Chick Lit':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b7');
                break;
            case 'Comming-Of-Age':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b8');
                break;
            case 'Anthology':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b9');
                break;
            case 'Drama':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7ba');
                break;
            case 'Crime':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bb');
                break;
            case 'Dictionary':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bc');
                break;
            case 'Health':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bd');
                break;
            case 'History':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7be');
                break;
            case 'Hornor':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bf');
                break;
            case 'Poetry':
                categoryID = mongoose.Types.ObjectId('5fcca69f41329f2ca085b7c0');
                break;
            default:

        }
        const update = {
            name: newName,
            cover: cover,
            category: newCategory,
            categoryID: categoryID,
            basePrice: newBasePrice,
            description: newDescription
        };
        try {
            Book.updateBook(filter, update);
            res.redirect('/books');
        }
        catch (err) {
            console.log(err);
        }
    });
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