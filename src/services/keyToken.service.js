// Tạo token
const keytokenModel = require("../models/keytoken.model");
const { Types, default: mongoose } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
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

      // lv 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // });

      // lv xxx
      const fitler = { user: userId }
      const update = { publicKey, privateKey, refeshTokenUsed: [], refreshToken }
      const option = { upsert: true, new: true }

      const tokens = await keytokenModel.findOneAndUpdate(fitler, update, option)
      console.log(tokens)
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id })
  }
}
module.exports = KeyTokenService;
