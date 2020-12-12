const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const Book = require('../models/listBook')

exports.index = (req, res, next) => {
    res.render('index');
}
exports.table = async(req, res, next) => {
    const Books = await Book.listBook();
    res.render('table', {Books});
}
exports.addBook = async(req, res, next) => {
    // const name = req.body.name;
    // const category = req.body.category;
    // const cover = [req.body.cover1, req.body.cover2, req.body.cover3];
    // const basePrice = req.body.basePrice;
    // const description = req.body.description;

    const form = formidable({ multiples: true });
    let cover = [];
    form.parse(req, (err, fields, files) => {
        if (err) {
        next(err);
        return;
        }
        
        if (files.cover1 && files.cover1.size > 0) {
            const name = files.cover1.path.split('/').pop();
            const extension = files.cover1.name.split('.').pop();
            cover.push('img/' + name + '.' + extension);
            const filePathCustomer = '/home/phamminhduy/Desktop/BTN05/BTN05-Customer/public/book-shop/img/';
            fs.renameSync(files.cover1.path, filePathCustomer + name + '.' + extension);
        }
        if (files.cover2 && files.cover2.size > 0) {
            const name = files.cover2.path.split('/').pop();
            const extension = files.cover2.name.split('.').pop();
            cover.push('img/' + name + '.' + extension);
            const filePathCustomer = '/home/phamminhduy/Desktop/BTN05/BTN05-Customer/public/book-shop/img/';
            fs.renameSync(files.cover2.path, filePathCustomer + name + '.' + extension);
        }
        if (files.cover3 && files.cover3.size > 0) {
            const name = files.cover3.path.split('/').pop();
            const extension = files.cover3.name.split('.').pop();
            cover.push('img/' + name + '.' + extension);
            const filePathCustomer = '/home/phamminhduy/Desktop/BTN05/BTN05-Customer/public/book-shop/img/';
            fs.renameSync(files.cover3.path, filePathCustomer + name + '.' + extension);
        }
        // res.json({ fields, files });
        let categoryID;
        switch(fields.category) {
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
        console.log(categoryID);
        const book = {
            name: fields.name,
            cover: cover,
            category: fields.category,
            categoryID: categoryID,
            basePrice: fields.basePrice,
            description: fields.description
        };
        try{
            Book.addOneBook(book);
            res.redirect('/tables');
        }
        catch(err){
            console.log(err);
        }
    });
}
exports.updateBook = async(req, res, next) => {
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
        if (err) {
        next(err);
        return;
        }
        
        if (files.newCover1 && files.newCover1.size > 0) {
            const name = files.newCover1.path.split('/').pop();
            const extension = files.newCover1.name.split('.').pop();
            cover.push('img/' + name + '.' + extension);
            const filePathCustomer = '/home/phamminhduy/Desktop/BTN05/BTN05-Customer/public/book-shop/img/';
            fs.renameSync(files.newCover1.path, filePathCustomer + name + '.' + extension);
        }
        if (files.newCover2 && files.newCover2.size > 0) {
            const name = files.newCover2.path.split('/').pop();
            const extension = files.newCover2.name.split('.').pop();
            cover.push('img/' + name + '.' + extension);
            const filePathCustomer = '/home/phamminhduy/Desktop/BTN05/BTN05-Customer/public/book-shop/img/';
            fs.renameSync(files.newCover2.path, filePathCustomer + name + '.' + extension);
        }
        if (files.newCover3 && files.newCover3.size > 0) {
            const name = files.newCover3.path.split('/').pop();
            const extension = files.newCover3.name.split('.').pop();
            cover.push('img/' + name + '.' + extension);
            const filePathCustomer = '/home/phamminhduy/Desktop/BTN05/BTN05-Customer/public/book-shop/img/';
            fs.renameSync(files.newCover3.path, filePathCustomer + name + '.' + extension);
        }
        // res.json({ fields, files });

        const filter = {_id : fields.id};
        let categoryID;
        switch(fields.newCategory) {
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
        try{
            Book.updateBook(filter, update);
            res.redirect('/tables');
        }
        catch(err){
            console.log(err);
        }
    });
}
exports.deleteBook = (req, res, next) => {
    const id = req.body.id;
    try{
        Book.deleteOneBook(id);
        res.redirect('/tables');
    }
    catch(err){
        console.log(err);
    }
}