const express = require("express");
const accessControler = require("../../controllers/access.controler");
const { asyncHandle } = require("../../auth/checkAuth");
const router = express.Router();

// signUp
router.post('/shop/login', asyncHandle(accessControler.login))
router.post('/shop/signup', asyncHandle(accessControler.signUP))

module.exports = router;