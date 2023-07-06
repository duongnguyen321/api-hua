## REST API Documentation

### Introduction

This is a REST API server built using json-server library. It provides endpoints for managing products, orders, users, and authentication.

### Prerequisites

- Node.js and npm should be installed on your system.

### Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies by running the following command:

### Usage

1. Start the server by running the following command:
   The server will start running on the specified port (default: 3001).

2. API Endpoints:

- **GET /products/type/:type**

  - Description: Get products by type with optional filtering by minPrice and maxPrice.
  - Parameters:
    - `type` (string): The type of products to retrieve. Use "all" to get all products.
    - `minPrice` (optional, number): The minimum price of products to retrieve.
    - `maxPrice` (optional, number): The maximum price of products to retrieve.
  - Returns: An array of products matching the specified criteria.

- **GET /products/:id**

  - Description: Get a product by its ID.
  - Parameters:
    - `id` (string): The ID of the product.
  - Returns: The product object with the specified ID.

- **GET /orders**

  - Description: Get orders with optional filtering by user_id or order_id.
  - Parameters:
    - `user_id` (optional, string): Filter orders by user ID.
    - `order_id` (optional, string): Get a specific order by its ID.
  - Returns: An object containing the orders matching the specified criteria.

- **POST /orders/create**

  - Description: Create a new order.
  - Request Body:
    - `items` (array): An array of objects representing the items to order. Each item should have `product_id` and `quantity` properties.
  - Returns: An object with the message "Đặt hàng thành công!" and the created order.

- **GET /users/:id**

  - Description: Get a user by their ID.
  - Parameters:
    - `id` (string): The ID of the user.
  - Returns: The user object with the specified ID (excluding the password).

- **PATCH /users/:id**

  - Description: Update a user's information.
  - Parameters:
    - `id` (string): The ID of the user to update.
  - Request Body: An object containing the updated user information (`name`, `address`, `phone`, `email`).
  - Returns: An object with the message "Cập nhật thông tin thành công!" and the updated user.

- **POST /admins/create**

  - Description: Create a new admin user (requires authentication).
  - Request Body: An object containing the new admin's information (`username`, `password`, `role`, `address`, `phone`, `name`, `email`).
  - Returns: An object with the message "Tạo admin mới thành công!" and the created admin.

- **POST /login**

  - Description: Authenticate a user and generate a token for further API calls.
  - Request Body: An object containing the user's `username` and `password`.
  - Returns: An object with the message “login successful!” and authenticated user information, including access token.

- **POST /register**

  - Description: Create a new user account.
  - Request Body: An object containing the new user's information (`username`, `password`, `name`, `email`, `address`, `phone`).
  - Returns: An object with the message “account registration successful!” and the created user, including access token and reset token.

- **GET /auth-token**

  Description: Automatically log in the user using **Authorization: Bearer AccessToken**.

  Parameters:

  - Body:
    `userId` (string): The user’s ID.
  - Header: authorization Bearer
    `accessToken` (string): The user’s access token.

  - Result: An object with the message “Automatic login successful!” and authenticated user information.

- **GET /reset-token**

  Description: Generate a new access token for the user.

  Parameters:

  - Body:
    `userId` (string): The user’s ID.

  - Header: authorization Bearer
    `resetToken` (string): The user’s reset token.

  - Result: An object with the message “Token reset successful!” and the new access token.

3. Authorization:

- Some endpoints require authentication. Use the `/login` endpoint to obtain a token, and include it in the `Authorization` header for authenticated requests.

### Notes

- The server uses a JSON file (db.json) as a database for storing products, orders, and users.
- The server supports basic CRUD operations for managing the data.
- Some endpoints require authentication and authorization based on user roles.
