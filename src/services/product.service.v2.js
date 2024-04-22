const { ConflicRequestError, BadRequestError } = require('../core/error.respone')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct
} = require('../models/repository/product.repo')

// use factory method parttern
// Define Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing' , 
        payload: 
     */
    // static async createProduct(type, payload) {
    //     switch (type) {
    //         case 'Electronics':
    //             return new Electronic(payload).createProduct()
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct()
    //         case 'Furniture':
    //             return new Furniture(payload).createProduct()
    //         default:
    //             throw new BadRequestError(`Invalid Product Type! ${type}`, 400)
    //     }
    // }

    // V2 use factory with strategy
    static productRegistry = {} // key and class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    // POST
    static createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type! ${type}`, 400)

        return new productClass(payload).createProduct()
    }

    // PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unpublishProductByShop({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id })
    }

    static async updateProduct() {

    }

    // query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async getListSearchProduct({ keySearch }) {
        const a = await searchProductByUser({ keySearch })
        console.log("Ket qua a", a)
        return a
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProduct({
            limit,
            sort,
            page,
            filter,
            select: ["product_name", "product_thumb", "product_price"]
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: [`__v`] })
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

    // async updateProduct(productId) {
    //     // 1. remove attribute  has null or undifined value
    //     const objectParams
    //     // 2. Check ở đâu?
    //     if (objectParams.product_attributes) {
    //         // update child [Clothing, Electronic, Furniture]
    //     }


    // }
}

// Define sub class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newFurniture = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new ConflicRequestError("Create New Furniture Error")

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new ConflicRequestError("Create New Furniture Error")

        return newProduct;
    }
}

// Define sub class for different product types Electronic
class Furniture extends Product {
    async createProduct() {
        const newElectronic = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new ConflicRequestError("Create New Electronic Error")

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new ConflicRequestError("Create New Product Error")

        return newProduct;
    }
}

// register product type
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;