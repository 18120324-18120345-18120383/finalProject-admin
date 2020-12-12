var express = require('express');
var router = express.Router();

const controllerAdmin = require('../controllers/controllerAdmin')
const controllerBooks = require('../controllers/controllerBooks')

/* GET home page. */
router.get('/', controllerBooks.index);
router.post('/checkLoginValid', controllerAdmin.checkLoginValid);
module.exports = router;
