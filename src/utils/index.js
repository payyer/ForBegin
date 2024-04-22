const _ = require("lodash");

// Hàm chung để lọc ra các fields cần trả về
const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

module.exports = {
    getInforData,
    getSelectData
}