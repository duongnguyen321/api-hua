const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = await jwt.sign(
    { userid: user.id, role: user.role },
    accessTokenSecret,
    { expiresIn: "1w" }
  );
  return accessToken;
};

const generateRefreshToken = async (user) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshToken = await jwt.sign({ userid: user.id }, refreshTokenSecret, {
    expiresIn: "60 days",
  });
  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
