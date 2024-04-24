const { unGetSelectData, getSelectData } = require("../../utils")

const findAllDiscountCodesUnSelect = async ({
    limit,
    page,
    sort = 'ctime',
    filter,
    model,
    unSelect = []
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: - 1 }
    const documents = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()
    return documents
}

const findAllDiscountCodesSelect = async ({
    limit,
    page,
    sort = 'ctime',
    filter,
    model,
    select = []
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: - 1 }
    const documents = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return documents
}

const checkDiscountExsit = async ({ model, filter }) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExsit
}
