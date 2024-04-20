const { default: mongoose } = require("mongoose")
const { product, electronic, clothing, furniture } = require("../product.model")

// query
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

// Put
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id),
    })

    if (!foundShop) return null

    foundShop.isDraft = false;
    foundShop.isPublished = true

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop
}