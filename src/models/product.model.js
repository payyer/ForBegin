const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_slug: {
        type: String,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    // more
    product_rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, `Rating can't be above 5.0`],
        // 4.3335 => 4.3
        // hàm set để thay đổi giá trị trước khi lưu vào db
        set: (value) => Math.round(value + 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false // when use find will don't get this filed to show
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false // when use find will don't get this filed to show
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// document middleware: runs before .save() and .create() ... 
// Trước khi vào hàm save và create sẽ đi qua hàm này
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


// define product type = clothing
const clothingSchema = new mongoose.Schema({
    barnd: {
        type: String,
        required: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Clothes',
    timestamps: true
})

// define product type = electronic
const electronicSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String
    },
    color: {
        type: String
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Electronics',
    timestamps: true
})

// define product type = furniture
const furnitureSchema = new mongoose.Schema({
    barnd: {
        type: String,
        required: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Furnitures',
    timestamps: true
})

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronic', electronicSchema),
    furniture: mongoose.model('Furniture', furnitureSchema),
}