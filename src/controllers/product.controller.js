const { SuccessRespone } = require('../core/success.respone')
const ProductService = require('../services/product.service')

class ProductController {
    createNewProduct = async (req, res, next) => {
        new SuccessRespone({
            message: "Create New Product Success!",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId // Lấy từ middleware ở trên (authentication)
            })
        }).send(res)
    }
}

module.exports = new ProductController()