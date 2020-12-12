const express = require('express');
const router = express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

const controllerAdmin = require('../controllers/controllerAdmin')
const controllerBooks = require('../controllers/controllerBooks')

router.use(express.urlencoded({ extended:false }))
router.use(flash())
router.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

const admins = []
admins.push(
    {
        id: 1,
        username: "duc",
        password: "123456"
    },
    {
        id: 2,
        username: "duy",
        password: "abcdef"
    }
)
initializePassport(
    passport,
    getAdminByUsername,
    getAdminById
)

/* GET home page. */
router.get('/', checkAuthenticated, controllerBooks.index);
router.get('/login', checkNotAuthenticated, controllerAdmin.index);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

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
function initializePassport(passport, getAdminByUsername, getAdminById){
    const authenticateUser = async (username, password, done) => {
        const admin = getAdminByUsername(username)
        console.log(admin)
        if (admin == null){
            return done(null, false, {message: "User name or pass word is incorrect!!!"})
        }

        try{
            if (password === admin.password){
                console.log(password)
                return done(null, admin)
            }
            else{
                return done(null, false, {message: "User name or pass word is incorrect!!!"})
            }
        }
        catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'username'
    }, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getAdminById(id))
    })
}
function getAdminByUsername(username){
    return admins.find(admin => admin.username == username)
}
function getAdminById(id){
    return admins.find(admin => admin.id = id)
}

module.exports = router