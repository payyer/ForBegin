const inventoryModel = require("../inventory.model")

const insertInventory = async ({ productId, shopId, stock, location = 'unknow' }) => {
    return await inventoryModel.create({
        inven_shopId: shopId,
        inven_location: location,
        inven_stock: stock,
        inven_productId: productId
    })
}

module.exports = {
    insertInventory
}