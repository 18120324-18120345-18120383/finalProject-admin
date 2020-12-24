const express = require('express');
const router = express.Router();
const passport = require('../passport/index');
const methodOverride = require('method-override')

const controllerAdmin = require('../controllers/controllerAdmin')
const controllerBooks = require('../controllers/controllerBooks')

router.use(express.static('public'))
router.use(methodOverride('_method'))

/* GET home page. */
router.get('/', checkAuthenticated, controllerBooks.index);
router.get('/login', checkNotAuthenticated, controllerAdmin.login);
router.get('/loginErr', checkNotAuthenticated, controllerAdmin.loginErr);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginErr',
    failureFlash: false
}))
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
router.get('/account-profile',checkAuthenticated, controllerAdmin.getProfile)
router.post('/account-profile', controllerAdmin.postProfile)
router.get('/change-password', checkAuthenticated, controllerAdmin.changePassword)
router.post('/change-password', controllerAdmin.postChangePassword)

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        res.redirect('/');
    }
    else{
        return next()
    }
}
module.exports = router