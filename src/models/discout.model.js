const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        discount_name: {
            type: String,
            required: true
        },
        discount_description: {
            type: String,
            required: true
        },
        // hàng tồn kho
        discount_type: {
            type: String,
            default: 'fixed amount' // or percentage
        },
        discount_value: {
            type: Number,  // 10.000 vnđ or 10%
            required: true
        },
        discount_code: {
            type: String,
            required: true
        },
        // Ngày bắt đầu
        discount_start_date: {
            type: Date,
            required: true
        },
        // ngày kết thúc
        discount_end_date: {
            type: Date,
            required: true
        },
        // sl vocher được phát hành
        discount_max_uses: {
            type: Number,
            required: true
        },
        // SL vocher đã sử dụng
        discount_uses_count: {
            type: Number,
            required: true
        },
        // Ai đã dụng voucher
        discount_users_used: {
            type: Array,
            default: []
        },
        // SL tối đa 1 user có thể sử dụng
        dicount_max_users_per_user: {
            type: Number,
            required: true
        },
        dicount_min_order_value: {
            type: Number,
            required: true,
        },
        dicount_shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        },
        dicount_is_active: {
            type: Boolean,
            default: true
        },
        discount_applies_to: {
            type: String,
            required: true,
            enum: ['all', 'specific'] // Vocher áp dụng trên tất cả sản phẩm hay các sản phẩm dc shop chọn
        },
        // Nếu discount_applies_to = specific
        // discount_product_ids chứa các sản phẩm shop chọn để áp dụng voucher
        discount_product_ids: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// //Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
