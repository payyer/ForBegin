const { CREATED } = require("../core/success.respone");
const AccessService = require("../services/access.service");

class AccessController {
    signUP = async (req, res, next) => {
        // console.log(`P::[signUP]::`, req.body);
        // return res.status(201).json(await AccessService.sighUp(req.body));

        new CREATED({
            message: 'Register OK!',
            metadata: await AccessService.sighUp(req.body),
            // Này là option nếu muốn thêm nhưng field khác về cho client
            // vd: limit page = 10
            // option: {
            //     limit: 10
            // }
        }).send(res)
    }

}

module.exports = new AccessController();