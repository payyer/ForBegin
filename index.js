require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default
let redisClient = new Redis(); // default localhost

// app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    store: new RedisStore({ client: redisClient }),
    resave: false, // Đặt lại session cookie cho mỗi yêu cầu
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    },
  })
);
app.get("/get-session", (req, res) => {
  res.send(req.session);
});
app.get("/set-session", (req, res) => {
  req.session.user = {
    userName: "Q.Anh",
    age: 23,
    email: `quocanhle112@gmail.com`,
  };
  res.send("Set OK!");
});

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Listen on port :${PORT}`));
