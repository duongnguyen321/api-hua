const jsonServer = require("json-server");
const server = jsonServer.create();
const bodyParser = require("json-server").bodyParser;
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 3001;

// accept all cors requests

server.use(cors());

// Import the routes
const productsRouter = require("../routes/products");
const ordersRouter = require("../routes/orders");
const usersRouter = require("../routes/users");
const adminsRouter = require("../routes/admins");
const authRouter = require("../routes/auth");
const rootRouter = require("../routes/root");

// Enable JSON body parsing
server.use(bodyParser);
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.set("Cache-Control", "no-store");
  next();
});

// configure all requests but not /auth/register , check jwt token is Expired or not

server.use((req, res, next) => {
  const { authorization, userid } = req.headers;
  if (
    req.path === "/products" ||
    req.path === "/auth/register" ||
    req.path === "/auth/login" ||
    req.path === "/auth/reset-token" ||
    req.path === "/api" ||
    // accept all requests for public files
    req.path.startsWith("/assets") ||
    req.path.startsWith("/images") ||
    req.path.startsWith("/")
  ) {
    return next();
  }

  // if req

  if (!authorization) {
    return res
      .status(401)
      .json({ message: "Access token không được cung cấp!" });
  }
  const accessToken = authorization.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token không hợp lệ!" });
  }
  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const { exp, userId } = decodedToken;
    if (userId !== userid) {
      return res.status(401).json({ message: "Access token không hợp lệ!" });
    }
    if (Date.now() >= exp * 1000) {
      return res.status(401).json({ message: "Access token đã hết hạn!" });
    }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Oops! Something went wrong!", navigation: "login" });
  }
});

// Use the routes
server.use("/products", productsRouter);
server.use("/orders", ordersRouter);
server.use("/users", usersRouter);
server.use("/admins", adminsRouter);
server.use("/auth", authRouter);
server.use("/", rootRouter);

// Start the server
server.listen(port, () => {
  console.log("App listening on port: " + port);
});
