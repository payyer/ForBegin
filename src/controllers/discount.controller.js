const { SuccessRespone } = require('../core/success.respone')
const DiscountService = require('../services/disscount.service')

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessRespone({
            message: "Create Discount code susscess!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodebyShop = async (req, res, next) => {
        new SuccessRespone({
            message: "Get All Discount code by Shop susscess!",
            metadata: await DiscountService.getAllDiscountCodebyShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessRespone({
            message: "Get All Discount code by Shop susscess!",
            metadata: await DiscountService.getAllDiscountCodeWithProduct(req.query)
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessRespone({
            message: "Get Discount Amount",
            metadata: await DiscountService.getDiscountAmount(req.body)
        }).send(res)
    }
}

module.exports = new DiscountController()