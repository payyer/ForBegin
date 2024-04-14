const jwt = require("jsonwebtoken");
const { asyncHandle } = require('../helpers/asyncHandler');
const { AuthFailError, NodeFoundError } = require("../core/error.respone");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    // payload để chứa thông tin từ hệ thống này sang hệ thống khác
    // privateKey không lưu vào DB chỉ xảy ra 1 lần khi đăng ký hoặc đăng nhập và đẩy về client
    const accessToken = await jwt.sign(payload, publicKey, {
      // algorithm: "RS256", khi dùng thuật toán RSA thì uncomment
      expiresIn: "2 days",
    });

    // refreshToken
    const refreshToken = await jwt.sign(payload, privateKey, {
      // algorithm: "RS256", khi dùng thuật toán RSA thì uncomment
      expiresIn: "2 days",
    });

    // Kiểm tra xem decode có ra kết quả không?
    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error("error verify::", err);
      } else {
        console.log("decode verify::", decoded);
      }
    });

    return { accessToken, refreshToken };

  } catch (error) {
    console.log(err.message);
  }
};

const authentication = asyncHandle(async (req, res, next) => {
  /*
    1 - check userId missing?
    2 - get accessToken 
    3 - Verify Token
    4 - Check User in DB 
    5 -Check KeyStore with this user ID
    6 - OK => return(next)
   */

  //  1 - check userId missing?
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailError("Invalid User Request")
  //  2 - get accessToken 
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NodeFoundError("Not Found KeyStore")

  // 3 - Verify Token
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailError("Invalid Request")

  try {
    // 5 -Check KeyStore with this user ID
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
    if (userId != decodeUser.userId) throw new AuthFailError("Invalid User")
    req.keyStore = keyStore
    return next()

  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecrect) => {
  return await jwt.verify(token, keySecrect)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
};
