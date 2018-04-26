const github = require("/github");
const models = require("../models");

module.exports = passport => {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log("==========Serializing User==========");
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("========Deserializing User========");
    models.user
      .find({
        where: {
          id: id
        }
      })
      .then(user => {
        done(null, user);
      })
      .catch(err => done(err, null));
  });
  github(passport);
};
