const _ = require("lodash");

// Hàm chung để lọc ra các fields cần trả về
const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

// ['a', 'b'] ==> {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a', 'b'] ==> {a: 0, b: 0}
const unGetUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

module.exports = {
    getInforData,
    getSelectData,
    unGetUnSelectData
}