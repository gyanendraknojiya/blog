const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = function (passport, User) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err,  { message : 'Something Went Wrong'});
        }
        if (!user) {
          return done(null, false,  { message : 'User does not exists'});
        } else {
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              console.log(err);
              return done(err,  { message : 'Something Went Wrong'})
            } else if (!result) {
              return done(null, false,  { message : 'Wrong Password entered'});
            } else{
                return done(null, user);
            }
          });
        }
    
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
