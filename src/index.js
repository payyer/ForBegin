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
// Check router của client nếu đúng thì pass qua middle tiếp theo
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    // Nếu không bắt được lỗi thì trả về 500
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;
