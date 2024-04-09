// Tạo token

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async (userId, publicKey, privateKey) => {
    try {
      // Lấy public key// chuyển đổi đoạn mã endcode thành string để lưu vào DB

      // // ---- START: Dùng RSA ---
      // const publicKeyString = publicKey.toString();

      // // Tạo token
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });
      // // ---- END: Dùng RSA ---

      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
