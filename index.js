const path = require("path");
const express = require("express");
const models = require("./models");
const bodyParser = require("body-parser");

const app = express(); //init our express app

//body-parser will take http request body and attach it
//to the request object automatticly for us
// Put these statements before you define any routes.
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//Configuring the app to use the right templeting engine
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views")); //where are the views?
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

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
      res.status(400);
      res.send(err.message);
    });
});

app.get("/pirate", (req, res) => {
  res.render("pirate-form");
});

app.post("/pirate", (req, res) => {
  models.Pirate.create(req.body)
    .then(data => {
      res.redirect(303, "pirates");
    })
    .catch(err => {
      res.status(400);
      res.send(err.message);
    });
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
