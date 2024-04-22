const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get('/search/:keySearch', asyncHandle(productController.getListSearchProduct))
router.get('', asyncHandle(productController.getAllProduct))
router.get('/detail/:product_id', asyncHandle(productController.getProduct))

// set authen for router
router.use(authentication)

router.post('', asyncHandle(productController.createNewProduct))
router.put('/publish/:id', asyncHandle(productController.publishProductByShop))
router.put('/unpublish/:id', asyncHandle(productController.unpublishProductByShop))

//query
router.get('/isDraft', asyncHandle(productController.getAllDraftForShop))
router.get('/published', asyncHandle(productController.getAllPublishForShop))

module.exports = router