const { CREATED, SuccessRespone } = require("../core/success.respone");
const AccessService = require("../services/access.service");

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        new SuccessRespone({
            message: "Get Token success",
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessRespone({
            message: 'Logout success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessRespone({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUP = async (req, res, next) => {
        console.log(`P::[signUP]::`, req.body);
        // return res.status(201).json(await AccessService.sighUp(req.body));

        new CREATED({
            message: 'Register OK!',
            metadata: await AccessService.signUp(req.body),
            // Này là option nếu muốn thêm nhưng field khác về cho client
            // vd: limit page = 10
            // option: {
            //     limit: 10
            // }
        }).send(res)
    }

}

module.exports = new AccessController();