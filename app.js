const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')
const session = require("express-session")
const bodyParser = require("body-parser");

const indexRouter = require('./routes/index');
const tableRouter = require('./routes/tables');

const app = express();

const url = "mongodb+srv://team-web:i031Onxb3JsJ0Gj9@cluster0.nhzle.mongodb.net/book-store?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => console.log('connected to db'))
.catch((err) => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// user
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next()
});

app.use('/', indexRouter);
app.use('/tables', checkAuthenticated, tableRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function checkAuthenticated(req, res, next){
  if (req.isAuthenticated()){
      return next()
  }

  res.redirect('/login')
}

module.exports = app;
