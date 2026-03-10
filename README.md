# InkMe-3D 👕

InkMe-3D là ứng dụng web cho phép người dùng **thiết kế và tùy chỉnh áo
thun 3D trực tiếp trên trình duyệt** với trải nghiệm tương tác thời gian
thực.

Ứng dụng sử dụng **WebGL thông qua Three.js** để hiển thị mô hình 3D và
cho phép người dùng thay đổi màu sắc, thêm hình ảnh hoặc họa tiết lên
sản phẩm, đồng thời quan sát thiết kế từ nhiều góc nhìn khác nhau trước
khi đặt hàng.

Dự án tập trung vào việc xây dựng **trải nghiệm người dùng trực quan,
hiệu năng cao và tương tác mượt mà trên nền tảng web**.

------------------------------------------------------------------------

# Demo

Live Demo:\
https://inkme3d.com

Preview:

![Preview](./public/demo.png)

------------------------------------------------------------------------

# Tính năng chính

### Tùy chỉnh sản phẩm 3D

-   Thay đổi màu sắc áo trực tiếp trên mô hình
-   Tải lên hình ảnh để in lên áo
-   Hiển thị kết quả theo thời gian thực

### Trình xem mô hình 3D tương tác

-   Xoay, phóng to và quan sát sản phẩm từ nhiều góc nhìn
-   Hệ thống ánh sáng và camera động
-   Tương tác mượt mà trên trình duyệt

### Tối ưu hiệu năng

-   Tối ưu mô hình 3D từ Blender
-   Giảm tải tài nguyên để đảm bảo tốc độ render
-   Duy trì trải nghiệm mượt khi thao tác với mô hình

------------------------------------------------------------------------

# Công nghệ sử dụng

## Frontend

-   React
-   Three.js
-   React Three Fiber
-   Tailwind CSS

## Công nghệ 3D

-   WebGL
-   Three.js
-   Blender

## Công cụ phát triển

-   Vite
-   Git / GitHub
-   npm

------------------------------------------------------------------------

# Kiến trúc dự án

    src
     ├── components        # UI components
     ├── canvas            # 3D scene và model rendering
     ├── pages             # Các trang của ứng dụng
     ├── assets            # Hình ảnh và mô hình 3D
     ├── utils             # Helper functions
     └── App.jsx

------------------------------------------------------------------------

# Quy trình hiển thị 3D

1.  Người dùng tải lên hình ảnh hoặc thay đổi màu sắc\
2.  Texture được xử lý và áp dụng lên mô hình\
3.  Three.js render lại scene theo thời gian thực\
4.  Người dùng có thể tương tác với model thông qua camera controls

------------------------------------------------------------------------

# Cài đặt và chạy dự án

## 1. Clone repository

    git clone https://github.com/InkMe-3D/InkMe-3D.git

## 2. Di chuyển vào thư mục dự án

    cd InkMe-3D

## 3. Cài đặt dependencies

    npm install

## 4. Chạy ứng dụng

    npm run dev

Ứng dụng sẽ chạy tại:

    http://localhost:5173

------------------------------------------------------------------------

# Mục tiêu của dự án

Dự án được xây dựng nhằm:

-   Khám phá khả năng của **3D trên nền tảng web**
-   Phát triển trải nghiệm **tùy chỉnh sản phẩm trực quan**
-   Nghiên cứu cách **tối ưu hiệu năng WebGL trong ứng dụng React**
-   Kết hợp **UI hiện đại với đồ họa 3D tương tác**

------------------------------------------------------------------------

# Hướng phát triển

Các tính năng có thể phát triển thêm trong tương lai:

-   Lưu thiết kế của người dùng
-   Tích hợp hệ thống đặt hàng
-   Thêm nhiều loại sản phẩm (hoodie, mũ, túi)
-   Tối ưu thêm hiệu năng render cho mobile
-   Thêm hệ thống quản lý sản phẩm

------------------------------------------------------------------------

# Tác giả

**Nguyễn Tiến Đạt**

Frontend Developer (React • Next.js • Three.js)

GitHub\
https://github.com/RinkVN

LinkedIn\
https://linkedin.com/in/datnguyendesign
