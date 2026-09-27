# 🚀 CD-Back-End (Hệ Thống Quản Lý Người Dùng & SaaS UI)

Dự án CD-Back-End xây dựng bằng **Node.js, Express, MongoDB, JWT Authentication** đi kèm giao diện **Frontend SaaS Dashboard (HTML5, Bootstrap 5, Vanilla JS)** và tài liệu **Swagger UI API Docs**.

---

## 📋 Yêu cầu phần mềm (Prerequisites)

Trước khi bắt đầu, đảm bảo máy tính đã được cài đặt:
- **Node.js**: Phiên bản >= 18.x ([Tải về tại đây](https://nodejs.org/))
- **MongoDB**: MongoDB Server chạy tại local (`mongodb://127.0.0.1:27017`) hoặc đường dẫn MongoDB Atlas.
- **Git**: Thao tác quản lý mã nguồn.

---

## 🛠️ Hướng dẫn Setup & Chạy Dự án từ đầu

### 1️⃣ Clone dự án về máy
Mở Terminal / Command Prompt và chạy lệnh:
```bash
git clone https://github.com/tonducquangdev-wq/cd_back_end.git
cd cd_back_end
```

### 2️⃣ Cài đặt các thư viện (Dependencies)
```bash
npm install
```

### 3️⃣ Tạo file cấu hình môi trường `.env`
Tạo một file tên là **`.env`** nằm tại **thư mục gốc của project** (nơi chứa file `server.js`) với nội dung:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/qlnv
JWT_SECRET=secretkey123
```

> 💡 *Ghi chú:*
> - `PORT`: Cổng ứng dụng (mặc định 5000).
> - `MONGO_URI`: Địa chỉ chuỗi kết nối cơ sở dữ liệu MongoDB.
> - `JWT_SECRET`: Khóa bí mật dùng để mã hóa và xác thực JWT token.

### 4️⃣ Đảm bảo MongoDB đang hoạt động
Mở dịch vụ MongoDB trên máy tính (ví dụ: MongoDB Compass, dịch vụ MongoDB Service trên Windows/Linux).

### 5️⃣ Khởi chạy Ứng dụng
```bash
npm start
```

Sau khi khởi chạy thành công, Terminal sẽ hiển thị:
```text
Server started on port 5000
Swagger Docs available at http://localhost:5000/api-docs
Connected to MongoDB
```

---

## 🌐 Đường Dẫn Truy Cập Trang Web & Tài Liệu API

| Tính Năng | Đường Dẫn (URL) | Mô Tả |
|---|---|---|
| 🔐 **Đăng Nhập** | `http://localhost:5000/login.html` | Trang giao diện đăng nhập thành viên |
| 📝 **Đăng Ký** | `http://localhost:5000/register.html` | Trang đăng ký tài khoản mới |
| 📊 **Dashboard** | `http://localhost:5000/dashboard.html` | Bảng điều khiển quản lý user, thống kê, phân trang & tìm kiếm |
| 📖 **Swagger API Docs** | `http://localhost:5000/api-docs` | Giao diện tài liệu & thử nghiệm API tương tác trực tiếp |

---

## ⚙️ Cấu trúc Thư mục Dự án

```text
cd-back-end/
├── .env                  # (Tự tạo) Biến môi trường
├── .gitignore            # Loại bỏ node_modules & .env khi commit
├── server.js             # Entry point khởi chạy Express Server
├── package.json          # Quản lý dependencies
├── config/
│   └── swagger.js        # Cấu hình Swagger JSDoc & OpenAPI 3.0
├── Controller/           # Xử lý logic từng API (CRUD User, Auth)
├── Middleware/
│   └── auth.js           # Middleware xác thực Token JWT
├── Model/
│   └── user.js           # Schema MongoDB Mongoose User
├── Router/
│   └── userRouter.js     # Định nghĩa các tuyến API và Swagger annotation
└── public/               # Thư mục chứa giao diện Frontend SaaS
    ├── index.html        # Trang điều hướng chính
    ├── login.html        # Giao diện Đăng nhập
    ├── register.html     # Giao diện Đăng ký
    ├── dashboard.html    # Giao diện Dashboard Quản lý
    ├── css/style.css     # Design System & Tùy chỉnh CSS
    └── js/               # Logic tương tác API thuần (Vanilla JS)
```
