const express = require('express');
const router = express.Router();
const controllerService = require('../controllers/controllerService')

router.use(express.static('public'));

router.get('/authenticate-password',controllerService.authenPassword);
router.get('/all-books', checkAuthenticated, controllerService.allBooks);
router.get('/all-users', checkAuthenticated, controllerService.allUsers);
router.get('/find-cover-by-id', checkAuthenticated, controllerService.findCoverById);
router.get('/check-exist-username', controllerService.checkExistUsername);
router.get('/check-exist-email', controllerService.checkExistEmail);

module.exports = router;

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
  
    res.redirect('/login')
  }