const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/controllerUser')
/* GET home page. */
router.use(express.static('public'));
router.get('/',controllerUser.index);
router.post('/update-user-account', controllerUser.updateUserAccount)
module.exports = router;
