var express = require('express');
var router = express.Router();
const controllerBook = require('../controllers/controllerBooks')
/* GET home page. */
router.use(express.static('public'));
router.get('/',controllerBook.books);
router.post('/add', controllerBook.addBook);
router.post('/update', controllerBook.updateBook);
router.post('/delete', controllerBook.deleteBook);
module.exports = router;
