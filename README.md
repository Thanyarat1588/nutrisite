# 🌿 NutriSite — เว็บไซต์ความรู้อาหารเพื่อสุขภาพ

แพลตฟอร์มให้ความรู้เรื่องอาหารเพื่อสุขภาพแบบเต็มระบบ  
**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express + MySQL

---

## 📁 โครงสร้างโปรเจกต์

```
nutrisite/
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── index.jsx         # Navbar, Footer, FoodCard, Spinner, ProtectedRoute
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # จัดการสถานะล็อกอิน Admin
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx        # หน้าแรก + Hero + หมวดหมู่ + แนะนำ
│   │   │   │   ├── FoodsPage.jsx       # รายการอาหาร + ค้นหา + กรอง
│   │   │   │   ├── FoodDetailPage.jsx  # รายละเอียดอาหาร
│   │   │   │   └── CategoriesPage.jsx  # หน้าหมวดหมู่ทั้งหมด
│   │   │   └── admin/
│   │   │       ├── AdminLoginPage.jsx      # หน้าเข้าสู่ระบบ Admin
│   │   │       ├── AdminLayout.jsx         # Layout + Sidebar Admin
│   │   │       ├── DashboardPage.jsx       # Dashboard + สถิติ
│   │   │       ├── AdminFoodsPage.jsx      # CRUD อาหาร + อัปโหลดรูป
│   │   │       └── AdminCategoriesPage.jsx # CRUD หมวดหมู่
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance + API helper functions
│   │   ├── App.jsx               # Routing หลักทั้งหมด
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
└── backend/                      # Node.js Backend
    ├── config/
    │   └── db.js                 # MySQL connection pool
    ├── middleware/
    │   ├── auth.js               # JWT Token verification
    │   └── upload.js             # Multer image upload
    ├── routes/
    │   ├── auth.js               # POST /login, GET /me, PUT /change-password
    │   ├── categories.js         # CRUD /categories
    │   └── foods.js              # CRUD /foods + image upload
    ├── database/
    │   └── schema.sql            # สร้างตาราง + Seed data
    ├── uploads/                  # ไฟล์รูปภาพที่อัปโหลด (auto-created)
    ├── server.js                 # Entry point
    ├── package.json
    └── .env.example
```

---

## 🗄️ ออกแบบฐานข้อมูล

```
admins
  id (PK) | username (UNIQUE) | password_hash | display_name | role | is_active | last_login

categories
  id (PK) | name | description | icon | color | bg_color | sort_order

foods
  id (PK) | category_id (FK→categories.id) | title | subtitle | description
  | calories | protein | carbs | fat | benefits (JSON)
  | image_url | emoji | bg_color | is_featured | is_active
```

---

## ⚙️ วิธีติดตั้งและรัน

### 1. สร้างฐานข้อมูล MySQL
```bash
mysql -u root -p < backend/database/schema.sql
```
> สร้างฐานข้อมูล `nutrisite_db` และใส่ข้อมูลตัวอย่างพร้อมให้

### 2. ติดตั้ง Backend
```bash
cd backend
cp .env.example .env
# แก้ไขค่า DB_USER, DB_PASS, JWT_SECRET ใน .env
npm install
npm run dev       # รันด้วย nodemon (port 5000)
```

### 3. ติดตั้ง Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # รันด้วย Vite (port 5173)
```

### 4. เปิดเว็บไซต์
- **หน้าเว็บ:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login
- **Backend API:** http://localhost:5000/api

---

## 🔐 ข้อมูลทดสอบ Admin
| ชื่อผู้ใช้ | รหัสผ่าน |
|-----------|---------|
| admin | admin1234 |

> ⚠️ ควรเปลี่ยนรหัสผ่านทันทีหลังติดตั้งจริง

---

## 🛣️ API Endpoints

### Auth
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|--------|----------|--------|---------|
| POST | /api/auth/login | สาธารณะ | เข้าสู่ระบบ |
| GET  | /api/auth/me | Admin | ข้อมูลตัวเอง |
| PUT  | /api/auth/change-password | Admin | เปลี่ยนรหัสผ่าน |

### Categories
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|--------|----------|--------|---------|
| GET | /api/categories | สาธารณะ | หมวดหมู่ทั้งหมด |
| GET | /api/categories/:id | สาธารณะ | หมวดหมู่เดียว |
| POST | /api/categories | Admin | เพิ่มหมวดหมู่ |
| PUT | /api/categories/:id | Admin | แก้ไขหมวดหมู่ |
| DELETE | /api/categories/:id | Admin | ลบหมวดหมู่ |

### Foods
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|--------|----------|--------|---------|
| GET | /api/foods | สาธารณะ | อาหารทั้งหมด (query: category_id, search, featured, limit, offset) |
| GET | /api/foods/:id | สาธารณะ | รายละเอียดอาหาร |
| POST | /api/foods | Admin | เพิ่มอาหาร (FormData + image) |
| PUT | /api/foods/:id | Admin | แก้ไขอาหาร (FormData + image) |
| DELETE | /api/foods/:id | Admin | ลบอาหาร |

---

## 📦 Package ที่ใช้

### Backend
- **express** — Web framework
- **mysql2** — MySQL driver (Promise-based)
- **bcryptjs** — Hash รหัสผ่าน
- **jsonwebtoken** — สร้าง/ตรวจสอบ JWT
- **multer** — อัปโหลดไฟล์รูปภาพ
- **cors** — Cross-Origin Resource Sharing
- **helmet** — Security headers
- **dotenv** — อ่านค่า .env

### Frontend
- **react + react-dom** — UI Framework
- **react-router-dom v6** — Client-side routing
- **axios** — HTTP Client
- **react-hot-toast** — Notification Toast

---

## 🔮 สิ่งที่ควรพัฒนาต่อในอนาคต

| หัวข้อ | รายละเอียด |
|--------|-----------|
| 🔍 Full-text Search | ใช้ MySQL FULLTEXT หรือ Elasticsearch |
| 📄 Pagination | เพิ่ม pagination บนหน้า Foods |
| 🖼️ Image Optimization | ใช้ Sharp ย่อ/แปลงรูปเป็น WebP อัตโนมัติ |
| 👤 Multi-admin | จัดการผู้ดูแลระบบหลายคน |
| 🏷️ Tags | ระบบ tag เพิ่มเติมจาก category |
| 💾 Cloud Storage | ย้ายรูปภาพไป AWS S3 หรือ Cloudinary |
| 📊 Analytics | ติดตามการเข้าชมด้วย Google Analytics |
| 🌐 i18n | รองรับหลายภาษา |
| 🧪 Testing | เพิ่ม unit test ด้วย Vitest + Supertest |
| 🚀 CI/CD | GitHub Actions + Docker deployment |
