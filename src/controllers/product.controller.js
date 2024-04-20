const { SuccessRespone } = require('../core/success.respone')
const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.v2')

class ProductController {
    // createNewProduct = async (req, res, next) => {
    //     new SuccessRespone({
    //         message: "Create New Product Success!",
    //         metadata: await ProductService.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId // Lấy từ middleware ở trên (authentication)
    //         })
    //     }).send(res)
    // }

    createNewProduct = async (req, res, next) => {
        new SuccessRespone({
            message: "Create New Product Success!",
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId // Lấy từ middleware ở trên (authentication)
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessRespone({
            message: "Get List  Draft Success!",
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessRespone({
            message: "Get List  Publish Success!",
            metadata: await ProductServiceV2.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    // QUERY
    /**
     * @des Get all Drafts for shop
     * @param {Number} limit 
     * @param {Number} Skip 
     * @return {JSON} res 
     */
    getAllDraftForShop = async (req, res, next) => {
        new SuccessRespone({
            message: "Get List  Draft Success!",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }


    /**
     * @des Get all Drafts for shop
     * @param {Number} limit 
     * @param {Number} Skip 
     * @return {JSON} res 
     */
    getAllPublishForShop = async (req, res, next) => {
        new SuccessRespone({
            message: "Get List  Draft Success!",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

}

module.exports = new ProductController()