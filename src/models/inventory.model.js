const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
    {
        inven_productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        inven_location: {
            type: String,
            default: 'unknow'
        },
        // hàng tồn kho
        inven_stock: {
            type: Number,
            required: true,
        },
        inven_shopId: {
            type: String,
            ref: 'Shop'
        },

        // field này quan trọng
        inven_reservation: {
            type: Schema.Types.Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// //Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
