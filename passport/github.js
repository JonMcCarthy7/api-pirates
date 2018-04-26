const GithubStrategy = require("passport-github").Strategy;
const models = require("../models");
const ghConfig = require("../gh.js");

module.exports = function(passport) {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: ghConfig.clientID,
        clientSecret: ghConfig.clientSecret,
        callbackUrl: ghConfig.callbackUrl
      },
      // github will send back the tokens and profile
      function(access_token, refresh_token, profile, done) {
        console.log(profile);
        models.User.findOne({ where: { github_auth_id: profile.id } })
          .then(user => {
            if (!user) {
              let newUser = models.User.create({
                github_auth_id: profile.id,
                name: profile.displayName,
                role: "user",
                email: profile.email
              });
              return done(null, newUser);
            }
            return done(null, user);
          })
          .catch(err => {
            console.log(err);
            return done(err, null);
          });
      }
    )
  );
};
