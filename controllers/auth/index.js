const authLoginController = require("./loginController");
const authRegisterController = require("./registerController");
const {
  autoLoginController,
  refreshTokenMiddleware,
} = require("./tokenController");

module.exports = {
  authLoginController,
  authRegisterController,
  autoLoginController,
  refreshTokenMiddleware,
};
