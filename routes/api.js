const express = require('express');
const router = express.Router();
const controllerService = require('../controllers/controllerService')

router.use(express.static('public'));

router.get('/authenticate-password',controllerService.authenPassword);
router.get('/all-books', controllerService.allBooks);
router.get('/all-users', controllerService.allUsers);

module.exports = router;
