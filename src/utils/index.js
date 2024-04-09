const _ = require("lodash");

// Hàm chung để lọc ra các fields cần trả về
const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

module.exports = {
    getInforData
}