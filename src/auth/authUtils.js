const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    // payload để chứa thông tin từ hệ thống này sang hệ thống khác
    // privateKey không lưu vào DB chỉ xảy ra 1 lần khi đăng ký hoặc đăng nhập và đẩy về client
    const accessToken = await jwt.sign(payload, privateKey, {
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

module.exports = {
  createTokenPair,
};
