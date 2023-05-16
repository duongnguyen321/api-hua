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
  - Returns: An object with the message "Đăng nhập thành công!" and the authenticated user's information.

- **POST /register**

  - Description: Create a new user account.
  - Request Body: An object containing the new user's information (`username`, `password`, `name`, `email`, `address`, `phone`).
  - Returns: An object with the message "Đăng ký tài khoản thành công!" and the created user.

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

- **GET /products/type/:type**

  - Mô tả: Lấy các sản phẩm theo loại với khả năng lọc tùy chọn bằng minPrice và maxPrice.
  - Tham số:
    - `type` (string): Loại sản phẩm cần lấy. Sử dụng "all" để lấy tất cả sản phẩm.
    - `minPrice` (tùy chọn, số): Giá tối thiểu của sản phẩm cần lấy.
    - `maxPrice` (tùy chọn, số): Giá tối đa của sản phẩm cần lấy.
  - Kết quả: Một mảng các sản phẩm phù hợp với các tiêu chí đã chỉ định.

- **GET /products/:id**

  - Mô tả: Lấy một sản phẩm bằng ID của nó.
  - Tham số:
    - `id` (string): ID của sản phẩm.
  - Kết quả: Đối tượng sản phẩm có ID đã chỉ định.

- **GET /orders**

  - Mô tả: Lấy đơn hàng với khả năng lọc tùy chọn bằng user_id hoặc order_id.
  - Tham số:
    - `user_id` (tùy chọn, string): Lọc đơn hàng theo ID người dùng.
    - `order_id` (tùy chọn, string): Lấy một đơn hàng cụ thể bằng ID của nó.
  - Kết quả: Một đối tượng chứa các đơn hàng phù hợp với các tiêu chí đã chỉ định.

- **POST /orders/create**

  - Mô tả: Tạo đơn hàng mới.
  - Body Yêu Cầu:
    - `items` (mảng): Một mảng các đối tượng đại diện cho các mục để đặt hàng. Mỗi mục phải có các thuộc tính `product_id` và `quantity`.
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
  - Thân Yêu Cầu: Đối tượng chứa thông tin người dùng đã cập nhật (`name`, `address`, `phone`, `email`).
  - Kết quả: Một đối tượng với thông báo "Cập nhật thông tin thành công!" và người dùng đã cập nhật.

- **POST /admins/create**

  - Mô tả: Tạo người dùng quản trị mới (yêu cầu xác thực).
  - Thân Yêu Cầu: Đối tượng chứa thông tin người dùng quản trị mới (`username`, `password`, `role`, `address`, `phone`, `name`, `email`).
  - Kết quả: Một đối tượng với thông báo "Tạo admin mới thành công!" và người dùng quản trị đã được tạo.

- **POST /login**

  - Mô tả: Xác thực người dùng và tạo mã thông báo cho các cuộc gọi API tiếp theo.
  - Thân Yêu Cầu: Đối tượng chứa `username` và `password` của người dùng.
  - Kết quả: Một đối tượng với thông báo "Đăng nhập thành công!" và thông tin người dùng đã được xác thực.

- **POST /register**

  - Mô tả: Tạo tài khoản người dùng mới.
  - Thân Yêu Cầu: Đối tượng chứa thông tin người dùng mới (`username`, `password`, `name`, `email`, `address`, `phone`).
  - Kết quả: Một đối tượng với thông báo "Đăng ký tài khoản thành công!" và người dùng đã được tạo.

3. Xác thực:

- Một số điểm cuối yêu cầu xác thực. Sử dụng điểm cuối `/login` để lấy mã thông báo và bao gồm nó trong tiêu đề `Authorization` cho các yêu cầu được xác thực.

### Ghi chú

- Máy chủ sử dụng một tệp JSON (db.json) làm cơ sở dữ liệu để lưu trữ sản phẩm, đơn hàng và người dùng.
- Máy chủ hỗ trợ các hoạt động CRUD cơ bản để quản lý dữ liệu.
- Một số điểm cuối yêu cầu xác thực và phân quyền dựa trên vai trò người dùng.
