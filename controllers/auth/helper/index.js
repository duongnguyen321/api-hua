const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = jwt.sign(
    { userid: user.id, role: user.role },
    accessTokenSecret,
    { expiresIn: "1w" }
  );
  return accessToken;
};

const generateResetToken = async (user) => {
  const resetTokenSecret = process.env.RESET_TOKEN_SECRET;
  const resetToken = jwt.sign({ userid: user.id }, resetTokenSecret, {
    expiresIn: "60 days",
  });
  return resetToken;
};

module.exports = {
  generateAccessToken,
  generateResetToken,
};
