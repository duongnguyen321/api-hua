const jsonServer = require("json-server");
const server = jsonServer.create();
const bodyParser = require("json-server").bodyParser;
const port = process.env.PORT || 3001;

// Import the routes
const productsRouter = require("../routes/products");
const ordersRouter = require("../routes/orders");
const usersRouter = require("../routes/users");
const adminsRouter = require("../routes/admins");
const authRouter = require("../routes/auth");
const rootRouter = require("../routes/root");

// Enable JSON body parsing
server.use(bodyParser);

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
