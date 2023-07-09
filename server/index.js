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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.set("Cache-Control", "no-store")
  next();
});

server.use((req, res, next) => {
  const { authorization, userid: userId } = req.headers;
  if (
    req.path === "/auth/login" ||
    req.path === "/auth/register" ||
    req.path === "/auth/refresh-token" ||

    req.path.startsWith("/products") ||
    req.path.startsWith("/assets") ||
    req.path.startsWith("/images") ||
    
    req.path === "/api" ||
    req.path === "/"
  ) {
    return next();
  }

  if (!userId) {
    return res.status(401).json({ message: "User id không được cung cấp!" });
  }

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
    const { exp, userid } = decodedToken;
    if (userid !== userId) {
      return res.status(401).json({ message: "Access token không hợp lệ!" });
    }
    if (Date.now() >= exp * 1000) {
      return res.status(401).json({ message: "Access token đã hết hạn!" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Oops! Something went wrong!" });
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
