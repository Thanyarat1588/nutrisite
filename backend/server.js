// ============================================================
// server.js — จุดเริ่มต้นของ Backend (Node.js + Express)
// ============================================================
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const path       = require('path');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const foodRoutes     = require('./routes/foods');
const settingsRoutes = require('./routes/settings');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// เสิร์ฟไฟล์รูปภาพที่อัปโหลด
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods',      foodRoutes);
app.use('/api/settings',   settingsRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// ── Error Handler ───────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

app.listen(PORT, () => console.log(`✅  Server running → http://localhost:${PORT}`));
