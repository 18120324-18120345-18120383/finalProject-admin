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
    console.log("Loading books...")

    let books = await Book.listBook();
   
    console.log("Load books successfully!")

    console.log("Loading categories")

    let categories = [];
    books.forEach(book => {
        const isExist = categories.find((category) => {
            return category == book.category
        })
        if (isExist === undefined) {
            categories.push(book.category)
        }
    });

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

    let categoryID;
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