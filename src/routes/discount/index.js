const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// get amount a discount
router.post('/amount', asyncHandle(discountController.getDiscountAmount))
router.get('/list-product-code', asyncHandle(discountController.getAllDiscountCodeWithProduct))

// Authentication
router.use(authentication)
router.post('', asyncHandle(discountController.createDiscountCode))

router.get('', asyncHandle(discountController.getAllDiscountCodebyShop))

module.exports = router;