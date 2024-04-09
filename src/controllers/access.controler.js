const AccessService = require("../services/access.service");

class AccessController {
    signUP = async (req, res, next) => {
        try 
        {
            console.log(`P::[signUP]::`, req.body);
            return res.status(201).json( await AccessService.sighUp(req.body));
        }
        catch(err) {

        }
    }
}

module.exports = new AccessController();