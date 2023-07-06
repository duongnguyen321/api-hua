const authLoginController = require("./loginController");
const authRegisterController = require("./registerController");
const {
  autoLoginController,
  resetTokenMiddleware,
} = require("./tokenController");
module.exports = {
  authLoginController,
  authRegisterController,
  autoLoginController,
  resetTokenMiddleware,
};
