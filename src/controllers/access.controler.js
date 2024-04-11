const AccessService = require("../services/access.service");

class AccessController {
    signUP = async (req, res, next) => {
        console.log(`P::[signUP]::`, req.body);
        return res.status(201).json(await AccessService.sighUp(req.body));
    }
}

module.exports = new AccessController();