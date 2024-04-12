const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const { ConflicRequestError, BadRequestError } = require("../core/error.respone");
const { findShopByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findShopByEmail({ email })
    if (!foundShop) throw new BadRequestError("Shop not registered", 404)

    const match = bcrypt.compareSync(password, foundShop.password)
    if (!match) throw new BadRequestError("Password incorrect ", 400)

    // Create private and public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken
    })

    return {
      shop: getInforData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    }
  }

  static signUp = async ({ name, email, password }) => {
    // kiểm tra email có tồn tại không
    console.log("password", password)
    const holderShop = await shopModel.findOne({ email }).lean(); // lean để tăng tốc độ , giảm size trả về
    if (holderShop) {
      throw new ConflicRequestError('Error: Shop is already exsit!')
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
        {
          userId: newShop._id,
          publicKey,
          privateKey
        }
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
