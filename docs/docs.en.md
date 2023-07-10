## REST API Documentation

---

### Introduction

This is a REST API server built using json-server library. It provides endpoints for managing products, orders, users, and authentication.

---

### Prerequisites

- Node.js and npm should be installed on your system.

---

### Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies by running the following command:

---

### Usage

1. Start the server by running the following command:

The server will start running on the specified port (default: 3001).

---

2. API Endpoints:

   ***

- **GET /products?type=:type**

  - Description: Get products by type with optional filtering by minprice and maxprice.
  - Parameters:
    - `type` (string): The type of products to retrieve. Use "all" to get all products.
    - `minprice` (optional, number): The minimum price of products to retrieve.
    - `maxprice` (optional, number): The maximum price of products to retrieve.
  - Returns: An array of products matching the specified criteria.

  ***

- **GET /products?id=:id**

  - Description: Get a product by its ID.
  - Parameters:
    - `id` (string): The ID of the product.
  - Returns: The product object with the specified ID.

- **GET /products**

  - Description: Get all products.
  - Returns: An array of products.

  ***

- **POST /products**

  - Description: Create a new product.
  - Headers:
    `userid` (string): The ID of the user creating the product.
    `Authorization: Bearer accessToken` (string): The user's access token.
  - Body: An object containing the information of the new product (`name: String`, `type: String`, `category: String`, `quantity: Number`, `price: Number`, `images: File`).
  - Response: An object with the message "New product added successfully!" and the created product.

  ```json
  {
    "headers": {
      "authorization": "Bearer AaCcCcEeSsSsTtOoKkEeNn"
    },
    "body": {
      "name": "Test Product",
      "price": 1,
      "quantity": 1,
      "type": "used",
      "category": "phone",
      "images": [
        "data:image/jpeg;base64,/9j/Base64ImageStringFromInputTypeFile.png",
        "data:image/jpeg;base64,/9j/Base64ImageStringFromInputTypeFile.jpeg"
      ]
    },
    "result": {
      "message": "Thêm sản phẩm mới thành công!",
      "product": {
        "id": "test-product",
        "name": "Test Product",
        "type": "used",
        "category": "phone",
        "quantity": 1,
        "price": 1,
        "images": [
          "/images/test-product/test-product-{random}.png",
          "/images/test-product/test-product-{random}.jpeg"
        ]
      }
    }
  }
  ```

  ***

- **PUT /products**

  - Description: Update product information.
  - Header:
    `userid` (string): The ID of the user updating the product.
    `Authorization: Bearer accessToken` (string): The user's access token.

  - Body: An object containing the information to update the product (`name: String`, `type: String`, `category: String`, `quantity: Number`, `price: Number`, `images: File`).

    - It can include some or all of the product attributes.

  - Response: An object with the message "Product updated successfully!" and the updated product.

  ```json
  {
    "headers": {
      "authorization": "Bearer AaCcCcEeSsSsTtOoKkEeNn"
    },
    "body": {
      "name": "Hello world" // Berfore: "Test Product"
    },
    "result": {
      "message": "Thêm sản phẩm mới thành công!",
      "product": {
        "id": "test-product",
        "name": "Hello world",
        "type": "used",
        "category": "phone",
        "quantity": 1,
        "price": 1,
        "images": [
          "/images/test-product/test-product-{random}.png",
          "/images/test-product/test-product-{random}.jpeg"
        ]
      }
    }
  }
  ```

  ***

- **DELETE /products**

  - Description: Delete a product by its ID.
  - Header:
    `userid` (string): The ID of the user deleting the product.
    `Authorization: Bearer accessToken` (string): The user's access token.
  - Query:
    - `id` (string): The ID of the product.
  - Response: An object with the message "Product deleted successfully!" and the deleted product.

  ***

- **GET /orders?userid=userid**

  - Description: Get orders with optional filtering by userid or orderid.(requires authentication).
  - Parameters:
    - `userid` (optional, string): Filter orders by user ID.
  - Returns: An object containing the orders matching the specified criteria.

  ```json
  {
    "headers": {
      "Authorization": "Bearer AaCcEeSsTtOoKkEeNn"
    },
    "result": {
      "orders": [
        {
          "id": "OoRrDdEeRrIiDd",
          "status": "Đang xử lý",
          "products": [
            {
              "id": "PpRrOoDdUuCcTtIiDd",
              "name": "Huawei Matebook X Pro",
              "type": "new",
              "category": "laptop",
              "quantity": 1,
              "price": 1499,
              "images": ["/images/image.webp", "/images/image.jpeg"]
            }
          ],
          "user": {
            "name": "Nguyen Duong",
            "email": "example@gmail.com",
            "address": "Address",
            "phone": "0987654321"
          },
          "totalPrice": 1499,
          "totalProduct": 1
        },
        {
          "id": "OoRrDdEeRrIiDd2",
          "status": "Đang xử lý",
          "products": [
            {
              "id": "PpRrOoDdUuCcTtIiDd",
              "name": "Huawei Matebook X Pro",
              "type": "new",
              "category": "laptop",
              "quantity": 1,
              "price": 1499,
              "images": ["/images/image.webp", "/images/image.jpeg"]
            }
          ],
          "user": {
            "name": "Nguyen Duong",
            "email": "example@gmail.com",
            "address": "Address",
            "phone": "0987654321"
          },
          "totalPrice": 1499,
          "totalProduct": 1
        }
      ]
    }
  }
  ```

  ***

- **GET /orders?orderid=:orderid**

  - Description: Get orders with optional filtering by userid or orderid.(requires authentication).
  - Parameters:
    - `orderid` (optional, string): Get a specific order by its ID.
  - Returns: An object containing the orders matching the specified criteria.

  ```json
  {
    "headers": {
      "Authorization": "Bearer AaCcEeSsTtOoKkEeNn"
    },
    "result": {
      "orders": {
        "id": "OoRrDdEeRrIiDd",
        "status": "Đang xử lý",
        "products": [
          {
            "id": "PpRrOoDdUuCcTtIiDd",
            "name": "Huawei Matebook X Pro",
            "type": "new",
            "category": "laptop",
            "quantity": 1,
            "price": 1499,
            "images": [
              "/images/huawei-matebook-x-pro/huawei-matebook-x-pro.webp",
              "/images/huawei-matebook-x-pro/huawei-matebook-x-pro2.webp"
            ]
          }
        ],
        "user": {
          "name": "Nguyen Duong",
          "email": "email@example.com",
          "address": "Address",
          "phone": "0987654321"
        },
        "totalPrice": 1499,
        "totalProduct": 1
      }
    }
  }
  ```

  ***

- **POST /orders**

  - Description: Create a new order.(requires authentication).
  - Request Body:
    - `items` (array): An array of objects representing the items to order. Each item should have `productid` and `quantity` properties.
  - Returns: An object with the message "Đặt hàng thành công!" and the created order.

  ```json
  {
    "headers": {
      "userid": "33f06aed-bd90-4ce3-8da3-d98998dd0c50"
    },
    "body": {
      "items": [
        {
          "productid": "1-hw-matebook-x-pro",
          "quantity": 1
        },
        {
          "productid": "2-hw-p50-pro",
          "quantity": 22
        },
        {
          "productid": "5-hw-p50-pocket",
          "quantity": 33
        }
      ]
    },
    "result": {
      "message": "Đặt hàng thành công!",
      "orders": [
        {
          "id": "24a704b8-da62-40f7-9d24-0abf2e876945",
          "productid": [
            "1-hw-matebook-x-pro",
            "2-hw-p50-pro",
            "5-hw-p50-pocket"
          ],
          "quantity": [1, 22, 33],
          "totalPrice": 46544,
          "status": "Đang xử lý"
        }
      ]
    }
  }
  ```

  ***

- **GET /users/:id**

  - Description: Get a user by their ID.(requires authentication).
  - Parameters:
    - `id` (string): The ID of the user.
  - Returns: The user object with the specified ID (excluding the password).

  ***

- **PATCH /users/:id**

  - Description: Update a user's information.(requires authentication).
  - Parameters:
    - `id` (string): The ID of the user to update.
  - Request Body: An object containing the updated user information (`name`, `address`, `phone`, `email`).
  - Returns: An object with the message "Cập nhật thông tin thành công!" and the updated user.

  ***

- **POST /admins/create**

  - Description: Create a new admin user (requires authentication).
  - Request Body: An object containing the new admin's information (`username`, `password`, `role`, `address`, `phone`, `name`, `email`).
  - Returns: An object with the message "Tạo admin mới thành công!" and the created admin.

  ```json
  {
    "headers": {
      "username": "AaDdMmIiNnUuSsEeRrNnAaMmEe",
      "password": "A@aDdMmIiNnPpAaSsSsWwOoRrDd"
    },
    "body": {
      "username": "AaDdMmIiNnUuSsEeRrNnAaMmEe2",
      "password": "A@aDdMmIiNnPpAaSsSsWwOoRrDd2",
      "address": "Address",
      "phone": "0123456789",
      "name": "Admin 2",
      "email": "admin@example.com"
    },
    "result": {
      "message": "Tạo admin mới thành công!",
      "admin": {
        "id": "AaDdMmIiNnUuSsEeRrIiDd",
        "username": "AaDdMmIiNnUuSsEeRrNnAaMmEe2",
        "address": "Address",
        "email": "admin@example.com",
        "phone": "0123456789",
        "name": "Admin 2",
        "role": "admin"
      }
    }
  }
  ```

  ***

- **POST /admins/hard-reset**

  - Description: Reset the database to its initial state (requires authentication).
  - Request Body: An object containing the new admin's information (`username`, `password`, `userid`, `accessToken`).
  - Returns: An object with the message "Restore data thành công!" and the database has been reset.

  ***

- **POST /auth/login**

  - Description: Authenticate a user and generate a token for further API calls.
  - Request Body: An object containing the user's `username` and `password`.
  - Returns: An object with the message “login successful!” and authenticated user information, including access token.

  ```json
  {
    "body": {
      "username": "AaDdMmIiNnUuSsEeRrNnAaMmEe2",
      "password": "A@aDdMmIiNnPpAaSsSsWwOoRrDd2"
    },
    "result": {
      "message": "Đăng nhập thành công!",
      "user": {
        "id": "AaDdMmIiNnUuSsEeRrIiDd2",
        "username": "AaDdMmIiNnUuSsEeRrNnAaMmEe2",
        "address": "Address",
        "email": "admin@example.com",
        "phone": "0123456789",
        "name": "Admin 2",
        "role": "admin"
      },
      "accessToken": "AaCcEeSsTtOoKkEeNn",
      "refreshToken": "RrEeFfRrEeSsHhTtOoKkEeNn"
    }
  }
  ```

  ***

- **POST /auth/register**

  - Description: Create a new user account.
  - Request Body: An object containing the new user's information (`username`, `password`, `name`, `email`, `address`, `phone`).
  - Returns: An object with the message “account registration successful!” and the created user, including access token and refresh token.

  ```json
  {
    "body": {
      "username": "user",
      "password": "user",
      "name": "Nguyen Duong",
      "email": "email@example.com",
      "address": "Address",
      "phone": "0987654321"
    },
    "result": {
      "message": "Đăng ký tài khoản thành công!",
      "user": {
        "id": "UuSsEeRrIiDd",
        "username": "user",
        "name": "Nguyen Duong",
        "email": "email@example.com",
        "address": "Address",
        "phone": "0987654321",
        "role": "user"
      },
      "accessToken": "AaCcEeSsTtOoKkEeNn",
      "refreshToken": "RrEeFfRrEeSsHhTtOoKkEeNn"
    }
  }
  ```

  ***

- **POST /auth/auth-token**

  Description: Automatically log in the user using **Authorization: Bearer AccessToken**.

  Parameters:

  - Body:
    `userid` (string): The user’s ID.
  - Header: authorization Bearer
    `accessToken` (string): The user’s access token.

  - Result: An object with the message “Automatic login successful!” and authenticated user information.

  ```json
  {
    "headers": {
      "Authorization": "Bearer AaCcEeSsTtOoKkEeNn",
      "userid": "UuSsEeRrIiDd"
    },
    "result": {
      "message": "Đăng nhập tự động thành công!",
      "user": {
        "id": "UuSsEeRrIiDd",
        "username": "UuSsEeRrNnAaMmEe",
        "address": "AaDdDdRrEeSsSs",
        "email": "EeMmAaIiLl@email.com",
        "phone": "0987654321",
        "name": "MmYy NnAaMmEe",
        "role": "user"
      }
    }
  }
  ```

  ***

- **POST /auth/refresh-token**

  Description: Generate a new access token for the user.

  Parameters:

  - Header: authorization Bearer
    `refreshToken` (string): The user’s refresh token.

  - Body:
    `userid` (string): The user’s ID.
    `accessToken` (string): The user’s **old** access token.

  - Result: An object with the message “Token refresh successful!” and the new access token.

    ```json
    {
      "headers": {
        "Authorization": "Bearer RrEeFfRrEeSsHhTtOoKkEeNn",
        "userid": "UuSsEeRrIiDd"
      },
      "body": {
        "accessToken": "PreviousAaCcEeSsTtOoKkEeNn"
      },
      "result": {
        "message": "Refresh token thành công!",
        "accessToken": "NewAaCcEeSsTtOoKkEeNn"
      }
    }
    ```

  ```

  ```

---

3. Authorization:

- Some endpoints require authentication. Use the `/login` endpoint to obtain a token, and include it in the `Authorization` header for authenticated requests.

---

### Notes

- The server uses a JSON file (db.json) as a database for storing products, orders, and users.
- The server supports basic CRUD operations for managing the data.
- Some endpoints require authentication and authorization based on user roles.

---

### Heed

Except for the following endpoints, all other endpoints require authentication `userid` and `Authorization: Bearer accessToken` header.

---

- **GET /products?type=:type**

  ***

- **GET /products?id=:id**

  ***

- **POST /login**

  ***

- **POST /register**

  ***

- **POST /auth-token**

  ***

- **POST /refresh-token**

  ***

- **GET /assets/:path**

  ***

- **GET /images/:path**

  ***

- **GET /api**

  ***

- **GET /**
