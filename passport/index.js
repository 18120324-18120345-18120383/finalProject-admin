const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const listAdminModels = require('../models/listAdminModels')

passport.use(new LocalStrategy(
  async function (username, password, done) {
    const admin = await listAdminModels.authenticateAdmin(username, password) 
    if (!admin) {
      return done(null, false);
    }
    return done(null, admin);
  }
));

passport.serializeUser(function(admin, done) {
  done(null, admin._id);
});

passport.deserializeUser(async function(id, done) {
  const admin = await listAdminModels.getAdminByID(id);
  done(null, admin);
});

module.exports = passport;