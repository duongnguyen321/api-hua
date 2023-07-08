# ENGLISH

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

- **GET /products?type=:type**

  - Description: Get products by type with optional filtering by minprice and maxprice.
  - Parameters:
    - `type` (string): The type of products to retrieve. Use "all" to get all products.
    - `minprice` (optional, number): The minimum price of products to retrieve.
    - `maxprice` (optional, number): The maximum price of products to retrieve.
  - Returns: An array of products matching the specified criteria.

- **GET /products?id=:id**

  - Description: Get a product by its ID.
  - Parameters:
    - `id` (string): The ID of the product.
  - Returns: The product object with the specified ID.

- **POST /products**

  - Description: Create a new product.
  - Headers:
    `userid` (string): The ID of the user creating the product, must be an **admin**.
  - Body: An object containing the information of the new product (`name: String`, `type: String`, `category: String`, `quantity: Number`, `price: Number`, `images: File`).
  - Response: An object with the message "New product added successfully!" and the created product.

- **PUT /products**

  - Description: Update product information.
  - Header:
    `userid` (string): The ID of the user updating the product, must be an **admin**.
  - Body: An object containing the information to update the product (`name: String`, `type: String`, `category: String`, `quantity: Number`, `price: Number`, `images: File`).

    - It can include some or all of the product attributes.

  - Response: An object with the message "Product updated successfully!" and the updated product.

- **DELETE /products**

  - Description: Delete a product by its ID.
  - Header:
    `userid` (string): The ID of the user deleting the product, must be an **admin**.
  - Headers:
    - `id` (string): The ID of the product.
  - Response: An object with the message "Product deleted successfully!" and the deleted product.

- **GET /orders**

  - Description: Get orders with optional filtering by userid or orderid.
  - Parameters:
    - `userid` (optional, string): Filter orders by user ID.
    - `orderid` (optional, string): Get a specific order by its ID.
  - Returns: An object containing the orders matching the specified criteria.

- **POST /orders/create**

  - Description: Create a new order.
  - Request Body:
    - `items` (array): An array of objects representing the items to order. Each item should have `productid` and `quantity` properties.
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

- **POST /auth-token**

  Description: Automatically log in the user using **Authorization: Bearer AccessToken**.

  Parameters:

  - Body:
    `userid` (string): The user’s ID.
  - Header: authorization Bearer
    `accessToken` (string): The user’s access token.

  - Result: An object with the message “Automatic login successful!” and authenticated user information.

- **POST /reset-token**

  Description: Generate a new access token for the user.

  Parameters:

  - Body:
    `userid` (string): The user’s ID.

  - Header: authorization Bearer
    `resetToken` (string): The user’s reset token.

  - Result: An object with the message “Token reset successful!” and the new access token.

3. Authorization:

- Some endpoints require authentication. Use the `/login` endpoint to obtain a token, and include it in the `Authorization` header for authenticated requests.

### Notes

- The server uses a JSON file (db.json) as a database for storing products, orders, and users.
- The server supports basic CRUD operations for managing the data.
- Some endpoints require authentication and authorization based on user roles.

# VIETNAMESE

## Tài liệu REST API

### Giới thiệu

Đây là một máy chủ REST API được xây dựng bằng thư viện json-server. Nó cung cấp các điểm cuối để quản lý sản phẩm, đơn hàng, người dùng và xác thực.

### Yêu cầu tiên quyết

- Bạn cần cài đặt Node.js và npm trên hệ thống của bạn.

### Cài đặt

1. Sao chép kho lưu trữ.
2. Di chuyển đến thư mục dự án.
3. Cài đặt các phụ thuộc bằng cách chạy lệnh sau:

### Sử dụng

1. Khởi động máy chủ bằng cách chạy lệnh sau:
   Máy chủ sẽ bắt đầu chạy trên cổng đã chỉ định (mặc định: 3001).

2. Điểm cuối API:

- **GET /products?type=:type**

  - Mô tả: Lấy các sản phẩm theo loại với khả năng lọc tùy chọn bằng minprice và maxprice.
  - Tham số:
    - `type` (string): Loại sản phẩm cần lấy. Sử dụng "all" để lấy tất cả sản phẩm.
    - `minprice` (tùy chọn, số): Giá tối thiểu của sản phẩm cần lấy.
    - `maxprice` (tùy chọn, số): Giá tối đa của sản phẩm cần lấy.
  - Kết quả: Một mảng các sản phẩm phù hợp với các tiêu chí đã chỉ định.

- **GET /products?id=:id**

  - Mô tả: Lấy một sản phẩm bằng ID của nó.
  - Tham số:
    - `id` (string): ID của sản phẩm.
  - Kết quả: Đối tượng sản phẩm có ID đã chỉ định.

- **POST /products**

  - Mô tả: Tạo sản phẩm mới.
  - Header:
    `userid` (string): ID của người dùng tạo sản phẩm cần là một **admin**.
  - Body: Đối tượng chứa thông tin sản phẩm mới (`name: String`, `type: String`, `category: String`, `quantity: Number`, `price: Number`, `images: File`).
  - Kết quả: Một đối tượng với thông báo "Thêm sản phẩm mới thành công!" và sản phẩm đã được tạo.

- **PUT /products**

  - Mô tả: Cập nhật thông tin sản phẩm.
  - Header:
    `userid` (string): ID của người dùng cập nhật sản phẩm cần là một **admin**.
  - Body: Đối tượng chứa thông tin sản phẩm cần cập nhật (`name: String`, `type: String`, `category: String`, `quantity: Number`, `price: Number`, `images: File`).

    - Có thể bao gồm một số thuộc tính hoặc tất cả các thuộc tính của sản phẩm.

  - Kết quả: Một đối tượng với thông báo "Cập nhật sản phẩm thành công!" và sản phẩm đã cập nhật.

- **DELETE /products**

  - Mô tả: Xóa sản phẩm bằng ID của nó.
  - Header:
    `userid` (string): ID của người dùng xóa sản phẩm cần là một **admin**.
  - Tham số:
    - `id` (string): ID của sản phẩm.
  - Kết quả: Một đối tượng với thông báo "Xóa sản phẩm thành công!" và sản phẩm đã xóa.

- **GET /orders**

  - Mô tả: Lấy đơn hàng với khả năng lọc tùy chọn bằng userid hoặc orderid.
  - Tham số:
    - `userid` (tùy chọn, string): Lọc đơn hàng theo ID người dùng.
    - `orderid` (tùy chọn, string): Lấy một đơn hàng cụ thể bằng ID của nó.
  - Kết quả: Một đối tượng chứa các đơn hàng phù hợp với các tiêu chí đã chỉ định.

- **POST /orders/create**

  - Mô tả: Tạo đơn hàng mới.
  - Body Yêu Cầu:
    - `items` (mảng): Một mảng các đối tượng đại diện cho các mục để đặt hàng. Mỗi mục phải có các thuộc tính `productid` và `quantity`.
  - Kết quả: Một đối tượng với thông báo "Đặt hàng thành công!" và đơn hàng đã được tạo.

- **GET /users/:id**

  - Mô tả: Lấy thông tin người dùng bằng ID của họ.
  - Tham số:
    - `id` (string): ID của người dùng.
  - Kết quả: Đối tượng người dùng có ID đã chỉ định (loại trừ mật khẩu).

- **PATCH /users/:id**

  - Mô tả: Cập nhật thông tin người dùng.
  - Tham số:
    - `id` (string): ID của người dùng cần cập nhật.
  - Body: Đối tượng chứa thông tin người dùng đã cập nhật (`name`, `address`, `phone`, `email`).
  - Kết quả: Một đối tượng với thông báo "Cập nhật thông tin thành công!" và người dùng đã cập nhật.

- **POST /admins/create**

  - Mô tả: Tạo người dùng quản trị mới (yêu cầu xác thực).
  - Body: Đối tượng chứa thông tin người dùng quản trị mới (`username`, `password`, `role`, `address`, `phone`, `name`, `email`).
  - Kết quả: Một đối tượng với thông báo "Tạo admin mới thành công!" và người dùng quản trị đã được tạo.

- **POST /login**

  - Mô tả: Xác thực người dùng và tạo mã thông báo cho các cuộc gọi API tiếp theo.
  - Body: Đối tượng chứa `username` và `password` của người dùng.
  - Kết quả: Một đối tượng với thông báo "Đăng nhập thành công!" và thông tin người dùng đã được xác thực, bao gồm mã thông báo truy cập.

- **POST /register**

  - Mô tả: Tạo tài khoản người dùng mới.
  - Body: Đối tượng chứa thông tin người dùng mới (`username`, `password`, `name`, `email`, `address`, `phone`).
  - Kết quả: Một đối tượng với thông báo "Đăng ký tài khoản thành công!" và người dùng đã được tạo, bao gồm mã thông báo truy cập và mã thông báo đặt lại.

- **POST /auth-token**

  Mô tả: Tự động đăng nhập người dùng bằng **Authorization: Bearer AccessToken**.

  Tham số:

  - Body:
    `userid` (string): ID của người dùng.
  - Header: authorization Bearer
    `accessToken` (string): Mã thông báo truy cập của người dùng.

  - Kết quả: Một đối tượng với thông báo "Đăng nhập tự động thành công!" và thông tin người dùng đã được xác thực.

- **POST /reset-token**

  Mô tả: Tạo lại mã thông báo truy cập mới cho người dùng.

  Tham số:

  - Body:
    `userid` (string): ID của người dùng.

  - Header: authorization Bearer
    `resetToken` (string): Mã thông báo đặt lại của người dùng.

  - Kết quả: Một đối tượng với thông báo "Tạo lại mã thông báo thành công!" và mã thông báo truy cập mới.

3. Xác thực:

- Một số điểm cuối yêu cầu xác thực. Sử dụng điểm cuối `/login` để lấy mã thông báo và bao gồm nó trong tiêu đề `Authorization` cho các yêu cầu được xác thực.

### Ghi chú

- Máy chủ sử dụng một tệp JSON (db.json) làm cơ sở dữ liệu để lưu trữ sản phẩm, đơn hàng và người dùng.
- Máy chủ hỗ trợ các hoạt động CRUD cơ bản để quản lý dữ liệu.
- Một số điểm cuối yêu cầu xác thực và phân quyền dựa trên vai trò người dùng.
