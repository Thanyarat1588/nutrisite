// routes/settings.js — GET/PUT site settings (hero image ฯลฯ)
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const db      = require('../config/db');
const verify  = require('../middleware/auth');
const upload  = require('../middleware/upload');
const router  = express.Router();

// GET /api/settings — ดูค่าทั้งหมด (สาธารณะ)
router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.execute('SELECT `key`, `value` FROM settings');
    const data   = Object.fromEntries(rows.map(r => [r.key, r.value]));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings — อัปเดตค่า (Admin) + อัปโหลดรูป hero
router.put('/', verify, upload.single('hero_image'), async (req, res) => {
  try {
    const updates = { ...req.body };

    // ถ้ามีอัปโหลดรูปใหม่
    if (req.file) {
      // ลบรูปเก่า
      const [old] = await db.execute("SELECT `value` FROM settings WHERE `key` = 'hero_image'");
      if (old[0]?.value) {
        const oldPath = path.join(__dirname, '..', old[0].value);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.hero_image = `/uploads/${req.file.filename}`;
    }

    // upsert ทีละ key
    for (const [key, value] of Object.entries(updates)) {
      await db.execute(
        'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        [key, value, value]
      );
    }

    const [rows] = await db.execute('SELECT `key`, `value` FROM settings');
    const data   = Object.fromEntries(rows.map(r => [r.key, r.value]));
    res.json({ success: true, data, message: 'บันทึกการตั้งค่าสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/settings/hero-image — ลบรูป hero (Admin)
router.delete('/hero-image', verify, async (_req, res) => {
  try {
    const [rows] = await db.execute("SELECT `value` FROM settings WHERE `key` = 'hero_image'");
    if (rows[0]?.value) {
      const imgPath = path.join(__dirname, '..', rows[0].value);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await db.execute("UPDATE settings SET `value` = NULL WHERE `key` = 'hero_image'");
    res.json({ success: true, message: 'ลบรูปสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;