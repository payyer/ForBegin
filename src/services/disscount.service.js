/*
    Discount Service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount code [User | Shpo]
    4 - Verify discount code [user]
    5 - Delete discount Code [Shop | Admin]
    6 - Cancel discount code [User]
*/
const discountModel = require("../models/discout.model")

const { BadRequestError } = require("../core/error.respone")
const { convertStringToObjIdMongoDB } = require("../utils")
const { findAllProduct } = require("../models/repository/product.repo")
const { findAllDiscountCodesUnSelect, checkDiscountExsit } = require("../models/repository/discount.repo")

class DiscountService {
    // cái này còn lỗi nên xem lại
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, users_used,
            is_active, shopId, min_order_value, product_ids,
            applies_to, name, description, type,
            value, max_uses, uses_count, max_uses_per_user
        } = payload
        // Kiểm tra
        if (new Date() < new Date(start_date) && new Date() > new Date(end_date)) {
            throw BadRequestError("Discount code has expried")
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw BadRequestError("Discount start_date musst be before end_date")
        }

        // create index for discout
        const foundDiscount = await discountModel.findOne({
            discount_shopId: convertStringToObjIdMongoDB(shopId),
            discount_code: code
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active === true) {
            throw new BadRequestError("Discount is exsit!")
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used, // Lỗi ở đây
            discount_max_users_per_user: max_uses_per_user,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode() {
        //...
    }

    /*
        Get all discount codes available with Product from User
    */
    static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
        console.log({ code }, { shopId }, { limit }, { page })
        const foundDiscount = await discountModel.findOne({
            discount_shopId: convertStringToObjIdMongoDB(shopId),
            discount_code: code
        }).lean()

        if (!foundDiscount || foundDiscount.discount_is_active === false) {
            throw new BadRequestError("Discount not exsits!", 404)
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount

        let products

        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProduct({
                filter: {
                    product_shop: convertStringToObjIdMongoDB(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            // get all product
            products = await findAllProduct({
                filter: {
                    _id: { $in: discount_product_ids }, // tìm các id trong mảng discount_product_ids
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    /*
       Get all discount codes available with Product from Shop
   */
    static async getAllDiscountCodebyShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })

        return discounts
    }

    /*
        Apply Discount Code
    */
    static async getDiscountAmount({ code, shopId, products }) {
        const foundDiscount = await checkDiscountExsit({
            model: discountModel,
            filter: {
                discount_shopId: convertStringToObjIdMongoDB(shopId),
                discount_code: code
            }
        })
        console.log({ foundDiscount })
        if (!foundDiscount) throw new BadRequestError('Not found discount', 404)

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_users_used,
            discount_value,
            discount_type,
            discount_max_users_per_user,
            discount_product_ids,
            discount_applies_to
        } = foundDiscount

        if (!discount_is_active) throw new BadRequestError('Discount is expried')

        if (!discount_max_uses) throw new BadRequestError('Discount are out')

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError('Discount  is expried')
        }
        if (new Date() < new Date(discount_start_date)) {
            throw new BadRequestError('Discount  is expried')
        }

        // check xem có xét giá trị tối thiểu không
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Discount requires a minimum order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_users_per_user > 0) {
            const userUseDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUseDiscount) {
                //...
            }
        }

        let amount
        if (discount_applies_to === 'specific') {
            const checkProductAvailable = discount_product_ids.some(_id => products.some(item => _id === item.id))
            if (!checkProductAvailable) throw new BadRequestError("This discount not available with these products", 400)
            amount = discount_type === 'fixed-amount' ? discount_value : totalOrder * (discount_value / 100)
        } else {
            amount = discount_type === 'fixed-amount' ? discount_value : totalOrder * (discount_value / 100)
        }

        // check xem discount này là fix-amount hay percentage
        // const amount = discount_type === 'fixed-amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discountAmount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, code }) {
        const deleted = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shopId: shopId
        })

        return deleted
    }

    /*
        Canel discount code
    */

    static async cancelDiscountCode({ code, shopId, userId }) {
        const foundDiscount = await checkDiscountExsit({
            model: discountModel,
            filter: {
                discount_shopId: shopId,
                discount_code: code
            }
        })

        if (!foundDiscount) throw new BadRequestError(`Discount doesn't exit`, 404)

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_users_used: -1
            }
        })
        return result
    }
}

module.exports = DiscountService