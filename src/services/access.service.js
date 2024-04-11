const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const { BadRequestError } = require("../core/error.respone");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static sighUp = async ({ name, email, password }) => {
    // kiểm tra email có tồn tại không

    const holderShop = await shopModel.findOne({ email }).lean(); // lean để tăng tốc độ , giảm size trả về
    if (holderShop) {
      throw BadRequestError('Error: Shop is already exsit!')
    }
    // có thể cho salt theo document nhưng để 10 để CPU đỡ tốn
    const passwordHash = await bcrypt.hashSync(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: RoleShop.SHOP,
    });

    // Thuật toán bất đối xứng
    if (newShop) {
      // Created privateKey( sau khi tạo xog sẽ được đẩy cho user ), publicKey ( Lưu lại trong hệ thống )
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1", // public key CryptoGraphy Standards !
      //     format: "pem", // Định dạnh mã hóa chuỗi nhị phân
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1", // public key CryptoGraphy Standards !
      //     format: "pem", // Định dạnh mã hóa chuỗi nhị phân
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey }, { publicKey });
      // save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken(
        newShop._id,
        publicKey,
        privateKey
      );

      if (!keyStore) {
        return {
          code: "xxxx",
          message: "PublicKeyString Error",
        };
      }

      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log("Created Token Success: ", tokens);

      return {
        code: 201,
        metadata: {
          shop: getInforData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    // Nếu ko tạo được shop trả về null
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
