const express = require("express");
const accessControler = require("../../controllers/access.controler");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// signUp
router.post('/shop/login', asyncHandle(accessControler.login))
router.post('/shop/signup', asyncHandle(accessControler.signUP))

// Authentication
router.use(authentication)

router.post('/shop/logout', asyncHandle(accessControler.logout))


module.exports = router;