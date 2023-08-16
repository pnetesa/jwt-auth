const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_MAX_AGE,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_MAX_AGE,
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await tokenModel.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

module.exports = new TokenService();
