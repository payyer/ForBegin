const _ = require("lodash");
const { default: mongoose } = require("mongoose");

// Hàm chung để lọc ra các fields cần trả về
const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

// ['a', 'b'] ==> {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a', 'b'] ==> {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

// clear các filed = null or undefined khi clint gửi data về server
const removeUndefindObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key]
        }
    })

    return obj
}

/*  
    updateNestedObjectParser

    Cái này hơi quằng. Tìm hiểu kỹ hơn
    ex: 
    const a = {
        b: {
            c: 1,
            d: 2  
            e: 3 // nếu CLINET ko truyền 3 thì ko sao vì server chi bỏ đi thuộc tính tương ứng
        }
    }

    =>> db.collection.updateOne({
        `b.c`: 1,
        `b.d`: 2,

        // Quan trọng ở đây !!! ******************
        `e.d`: 3 // server sẽ bỏ b.e: 3 và chỉ update b.c và b.d nếu CLINET ko truyển b.e
    })

*/
const updateNestedObjectParser = obj => {
    console.log("Before object parser:::", obj)
    const final = {}
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const respone = updateNestedObjectParser(obj[key])
            Object.keys(respone).forEach(a => {
                final[`${key}.${a}`] = respone[a]
            })
        } else {
            final[key] = obj[key]
        }
    })
    console.log("Affter object parser:::", obj)

    return final
}

const convertStringToObjIdMongoDB = (id) => {
    return new mongoose.Types.ObjectId(id)
}

module.exports = {
    getInforData,
    getSelectData,
    unGetSelectData,
    removeUndefindObject,
    updateNestedObjectParser,
    convertStringToObjIdMongoDB
}