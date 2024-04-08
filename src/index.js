const express = require("express");
const mogran = require("morgan");
var compression = require('compression')
const helmet  = require ("helmet");
const app = express();

// -----Init middleware-----
app.use(mogran("dev"));
// app.use(mogran("combined")); Dùng product thì dùng này
app.use(helmet());
app.use(compression());

// -----Init DB-----

require("./db/init.mongodb");
const {checkOverLoad} = require("./helpers/check.connect");
checkOverLoad();
// -----Init routes-----

// -----handling error-----

module.exports = app;