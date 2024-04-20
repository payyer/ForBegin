const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const { asyncHandle } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");

// set authen for router
router.use(authentication)
router.post('', asyncHandle(productController.createNewProduct))
router.put('/publish/:id', asyncHandle(productController.publishProductByShop))

//query
router.get('/isDraft', asyncHandle(productController.getAllDraftForShop))
router.get('/published', asyncHandle(productController.getAllPublishForShop))

module.exports = router