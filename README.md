# GO Assignment

Ung dung tra cuu diem thi THPT tu file du lieu tho `diem_thi_thpt_2024.csv`.

## Tech stack

- Frontend: React, Vite, React Hooks, Chart.js, Tailwind CSS, Rubik font
- Backend: Node.js, Express, Mongoose
- Database: MongoDB

## Features

- Import du lieu tu `Server/data/diem_thi_thpt_2024.csv` vao MongoDB.
- Tra cuu diem theo so bao danh.
- Feature report theo 4 muc diem: `>= 8`, `6 - < 8`, `4 - < 6`, `< 4`.
- Bieu do thong ke so luong thi sinh theo tung muc diem va tung mon.
- Danh sach top 10 thi sinh khoi A: Toan, Vat ly, Hoa hoc.
- Giao dien responsive co ban cho desktop, tablet va mobile.

## Run locally

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Environment

Tao file `Server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Dat file du lieu tai:

```text
Server/data/diem_thi_thpt_2024.csv
```

### 3. Run full app from root

```bash
npm run dev
```

Lenh tren se khoi dong ca backend va frontend:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

Khi backend start, he thong se tu kiem tra MongoDB. Neu collection chua co du lieu, he thong se import CSV tu folder `Server/data`.

Co the chay import thu cong tu root:

```bash
npm run seed
```

## API

- `GET /health`
- `GET /api/scores/:registrationNumber`
- `GET /api/statistics`
- `GET /api/top-students`

## Demo link

Chua deploy.
