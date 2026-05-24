// ============================================================
// middleware/auth.js — ตรวจสอบ JWT Token สำหรับ Admin
// ============================================================
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'ไม่พบ Token กรุณาเข้าสู่ระบบ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin     = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
};

module.exports = verifyToken;
