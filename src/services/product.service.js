const { ConflicRequestError, BadRequestError } = require('../core/error.respone')
const { product, clothing, electronic } = require('../models/product.model')

// use factory method parttern
// Define Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing' , 
        payload: 
     */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Type! ${type}`, 400)
        }
    }
}

// Define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct(product_id) {
        // this là các property khai báo trong contructor
        return await product.create({
            ...this,
            _id: product_id // này là toán tử Spread // quên lên gg đọc
        })
    }
}

// Define sub class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop // xet field ProductShop của collection child trùng với shopId dc truyền từ trên
        })
        if (!newClothing) throw new ConflicRequestError("Create New Clothing Error")

        // Dùng Id clothng = với Id của Product luôn
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new ConflicRequestError("Create New Product Error")

        return newProduct;
    }
}

// Define sub class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new ConflicRequestError("Create New Electronic Error")

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new ConflicRequestError("Create New Product Error")

        return newProduct;
    }
}

module.exports = ProductFactory;