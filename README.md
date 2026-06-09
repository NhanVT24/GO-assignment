# GO Assignment

Web tra cứu dữ liệu điểm thi

## Tech stack

- Frontend: React, Vite, React Hooks, Chart.js, Tailwind CSS, Rubik font
- Backend: Node.js, Express, Mongoose
- Database: MongoDB

## Features

- Backend sẽ tự động load dữ liệu từ data vào db thông qua importStudents, nếu có cập nhật sẽ gọi syncStudent - cả 2 file đều nằm ở folder seeders
- Hỗ trợ việc nhập và tra cứu số báo danh thông qua hàm getScoreByRegistrationNumber được định nghĩa tạo ScoreController
- Dùng chart.js để hỗ trợ việc tạo biểu đồ dựa trên 4 cột `>= 8`, `6 - < 8`, `4 - < 6`, `< 4`.
- Ngoài ra, còn hỗ trợ dạng biểu đồ tròn theo số điểm hiển thị số học sinh theo môn
- Lọc ra danh sách học sinh top 10 khối A thông qua hàm getTop10GroupA
- Giao diện responsive tối ưu cho desktop, mobie

## Run locally

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Environment

Có file .env.example, từ đó sẽ tạo file .env trong server để có thể chạy dự án

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. Run full app from root

```bash
npm run dev
```
=> Lệnh đó sẽ chạy cả be và fe cho dự án 

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

Mỗi khi chạy dự án, database sẽ được check và sync lại data thông qua csvParser

## Run with Docker

### Dev mode

Project này có sẵn 3 file để chạy Docker ở chế độ dev:

- [Client/Dockerfile](Client/Dockerfile)
- [Server/Dockerfile](Server/Dockerfile)
- [docker-compose.yml](docker-compose.yml)

### 1. Yêu cầu trước khi chạy

- Cài Docker Desktop
- Bật Docker Engine
- Ở thư mục gốc dự án phải có `Server/data/diem_thi_thpt_2024.csv`

### 2. Build và chạy toàn bộ stack

```bash
docker compose up --build
```

Lệnh này sẽ khởi động:

- MongoDB ở cổng `27017`
- Backend ở cổng `5000`
- Frontend ở cổng `5173`

### 3. URL sau khi chạy

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/health`

### 4. Dừng stack

```bash
docker compose down
```

Nếu muốn xoá luôn dữ liệu MongoDB đã lưu trong volume:

```bash
docker compose down -v
```

### 5. File nào làm gì

- `Client/Dockerfile`: cài dependencies và chạy Vite dev server
- `Server/Dockerfile`: cài dependencies và chạy API Node.js
- `docker-compose.yml`: nối client, server, mongo thành một hệ thống
- `.dockerignore`: loại file thừa để build nhanh hơn

### 6. Lưu ý khi chạy bằng Docker

- Frontend đang đọc API URL từ `VITE_API_BASE_URL`
- Trong `docker-compose.yml`, biến này đang trỏ về `http://localhost:5000/api`
- Nếu bạn đổi sang production, nên chuyển client sang build tĩnh và serve bằng Nginx

## Run with Docker - Production

### 1. File production

- [Client/Dockerfile.prod](Client/Dockerfile.prod)
- [Client/nginx.conf](Client/nginx.conf)
- [Server/Dockerfile.prod](Server/Dockerfile.prod)
- [docker-compose.prod.yml](docker-compose.prod.yml)

### 2. Build và chạy production

```bash
docker compose -f docker-compose.prod.yml up --build
```

Lệnh này sẽ khởi động:

- MongoDB ở cổng `27017`
- Backend ở cổng `5000`
- Frontend production qua Nginx ở cổng `5173`

### 3. URL sau khi chạy production

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/health`

### 4. Dừng production stack

```bash
docker compose -f docker-compose.prod.yml down
```

Nếu muốn xoá luôn dữ liệu MongoDB đã lưu trong volume:

```bash
docker compose -f docker-compose.prod.yml down -v
```

## API

- `GET /health` : Kiểm tra dự án có đang chạy hay không
- `GET /api/scores/:registrationNumber` : check điểm theo số báo danh
- `GET /api/statistics` : lấy toàn bộ điểm để làm dạng biểu đồ 
- `GET /api/top-students` : lấy top 10 sinh viên khối A

## Demo link

Client Deploy: [https://go-ass.vercel.app/](https://go-ass.vercel.app/)

Server Deploy: [https://go-assignment-jpdv.onrender.com](https://go-assignment-jpdv.onrender.com/health)