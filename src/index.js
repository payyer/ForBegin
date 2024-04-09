const express = require("express");
const mogran = require("morgan");
var compression = require("compression");
const helmet = require("helmet");
const app = express();

// -----Init middleware-----
app.use(mogran("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----Init DB-----
require("./db/init.mongodb");
const { checkOverLoad } = require("./helpers/check.connect");
checkOverLoad();

// -----Init routes-----
app.use("", require("./routes/index"));

// -----handling error-----

module.exports = app;
