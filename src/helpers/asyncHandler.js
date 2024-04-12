// Handle error funtion truyền vào từ Rotuer
const asyncHandle = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    asyncHandle
}