// ============================================================
// routes/auth.js — เข้าสู่ระบบ / เปลี่ยนรหัสผ่าน Admin
// ============================================================
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');
const verify   = require('../middleware/auth');
const router   = express.Router();

// POST /api/auth/login — เข้าสู่ระบบ
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });

    const [rows] = await db.execute(
      'SELECT * FROM admins WHERE username = ? AND is_active = 1 LIMIT 1',
      [username]
    );
    if (!rows.length)
      return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const admin   = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    // อัปเดต last_login
    await db.execute('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, display_name: admin.display_name, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me — ดูข้อมูลตัวเอง (ต้องล็อกอิน)
router.get('/me', verify, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, username, display_name, role, last_login FROM admins WHERE id = ?',
      [req.admin.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/change-password — เปลี่ยนรหัสผ่าน
router.put('/change-password', verify, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const [rows] = await db.execute('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const admin  = rows[0];
    const ok     = await bcrypt.compare(old_password, admin.password_hash);
    if (!ok) return res.status(400).json({ success: false, message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
    const hash = await bcrypt.hash(new_password, 12);
    await db.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.admin.id]);
    res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
