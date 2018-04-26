const path = require("path");
const express = require("express");
const models = require("./models");
const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;
const bodyParser = require("body-parser");

const app = express(); //init our express app

app.use(require("morgan")("combined")); //logging
app.use(require("cookie-parser")()); //like body-parse, but for cookies
app.use(
  require("express-session")({
    secret: "bananaPants",
    name: "Pirate-cookie-monster"
  })
);
//Configs passport
app.use(passport.initialize());
app.use(passport.session());

const initPassport = require("./passport/init");
initPassport(passport);

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//body-parser will take http request body and attach it
//to the request object automatticly for us
// Put these statements before you define any routes.
// support parsing of application/json type post data
app.use(bodyParser());

//Configuring the app to use the right templeting engine
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views")); //where are the views?
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

/* this checks to see passport has deserialized 
and appended the user to the request */
const isAuth = (req, res, next) => {
  console.log("=======Auth Check=======");
  if (req.user) {
    return next();
  } else return res.render("login", {});
};

//Routing Town!!!
app.get("/", (req, res) => {
  models.Pirate.findAll({
    order: [["createdAt", "DESC"]]
  })
    .then(data => {
      res.render("pirates", {
        pirates: data
      });
    })
    .catch(err => {
      res.status("400");
      res.send(err.message);
    });
});

app.get("/pirate", isAuth, (req, res) => {
  res.render("pirate-form");
});

app.post("/pirate", (req, res) => {
  if (req.body.family_name !== "") {
    models.Pirate.create(req.body)
      .then(data => {
        // res.send(data);
        res.redirect("/");
      })
      .catch(err => {
        res.status("409");
        res.send(err.message);
      });
    //insert into the DB
  } else {
    res.sendStatus("400");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isAuth, function(req, res) {
  res.render("profile", { user: req.user });
});

app.get("/users", isAuth, (req, res) => {
  models.User.findAll({
    order: [["createdAt", "DESC"]]
  })
    .then(data => {
      res.render("users", { users: data });
    })
    .catch(err => {
      res.status("400");
      res.send(err.message);
    });
});

//register Github route
app.get(
  "/login/github",
  passport.authenticate("github", { session: true, failureRedirect: "/" })
);

app.get(
  "/login/github/callback",
  passport.authenticate("github", { failureRedirect: "/pirates" }),
  function(req, res) {
    res.redirect("/profile");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//Finally setting the app to listen gets it going
// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function() {
  app.listen(app.get("port"), () => {
    console.log(
      "Express started on http://localhost:" +
        app.get("port") +
        "; press Ctrl-C to terminate."
    );
  });
});
