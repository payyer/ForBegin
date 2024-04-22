const { default: mongoose } = require("mongoose")
const { product, electronic, clothing, furniture } = require("../product.model")
const { getSelectData, unGetUnSelectData } = require("../../utils")

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

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product
        .find({
            isPublished: true,
            $text: { $search: regexSearch }
        }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } }) // Tính điểm: từ tìm kiếm càng match sẽ dc hiện thị truóc
        .lean()

    return results
}

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    // Này đơn giản: nếu page = 1, limit 50 => skip = 0 * 50 ==> không skip sản phẩm nào
    // page = 1 ==> 1 * 50 ==> skip 50 sản phẩm đầu ở page 2
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: - 1 }
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product
        .findById(product_id)
        .select(unGetUnSelectData(unSelect))
        .lean()
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

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id),
    })

    if (!foundShop) return null

    foundShop.isDraft = true;
    foundShop.isPublished = false


    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct
}