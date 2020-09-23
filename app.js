/* eslint-disable no-undef */
/* eslint-disable no-console */
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./config/database");

mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on("connected", () => {
    console.log("Connected to Database " + config.database);
});

mongoose.connection.on("error", (err) => {
    console.log("Database error " + err);
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();

app.set('environment', config.environment);

const users = require("./routes/users");
const todoList = require("./routes/todoList");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    expressValidator({
        errorFormatter: function (param, msg, value) {
            var namespace = param.split("."),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += "[" + namespace.shift() + "]";
            }
            return {
                param: formParam,
                msg: msg,
                value: value,
            };
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/users", users);
app.use("/api/v1/todoList", todoList);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

if(!module.parent) {
    const server = app.listen(config.port);
    console.log(`Running on port ${config.port}...`);
 }

module.exports = app


