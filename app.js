var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var inmuebles = require("./routes/inmuebles");
var tipos = require("./routes/tipos");
var usuarios = require("./routes/usuarios");

var app = express();
const fileUpload = require('express-fileupload');
const passport = require('passport');

// Mongoose
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/inmuebles");
// Fin Mongoose

const Tipo = require("./models/tipo");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(fileUpload());

app.use((req, res, next) => {
    Tipo.find()
        .then(resultado => {
            res.locals.tipos = resultado;
            next();
        })
        .catch(error => {
           res.locals.error = error;
          next();
        });
});

app.use(express.static('./public'));
app.use("/", index);
app.use("/inmuebles", inmuebles);
app.use("/tipos", tipos);
app.use('/usuarios', usuarios);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
