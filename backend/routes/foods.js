// ============================================================
// routes/foods.js — CRUD อาหารสุขภาพ + อัปโหลดรูปภาพ
// ============================================================
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const db      = require('../config/db');
const verify  = require('../middleware/auth');
const upload  = require('../middleware/upload');
const router  = express.Router();

// ── helpers ─────────────────────────────────────────────────
const parseJson = (v, fallback = []) => {
  try { return typeof v === 'string' ? JSON.parse(v) : (v || fallback); }
  catch { return fallback; }
};

// GET /api/foods — รายการทั้งหมด (สาธารณะ) พร้อม filter + search
router.get('/', async (req, res) => {
  try {
    const { category_id, search, featured, limit = 50, offset = 0 } = req.query;
    let sql    = `SELECT f.*, c.name AS category_name, c.icon AS category_icon,
                         c.color AS category_color, c.bg_color AS category_bg
                  FROM foods f
                  LEFT JOIN categories c ON c.id = f.category_id
                  WHERE f.is_active = 1`;
    const params = [];
    if (category_id)          { sql += ' AND f.category_id = ?';         params.push(category_id); }
    if (search)               { sql += ' AND (f.title LIKE ? OR f.subtitle LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (featured === 'true')  { sql += ' AND f.is_featured = 1'; }
    sql += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows]  = await db.execute(sql, params);
    const [[{total}]] = await db.execute(
      `SELECT COUNT(*) AS total FROM foods WHERE is_active = 1${category_id ? ' AND category_id = ' + db.escape(category_id) : ''}`
    );
    const parsed = rows.map(r => ({ ...r, benefits: parseJson(r.benefits) }));
    res.json({ success: true, data: parsed, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/foods/:id — รายละเอียดเดียว (สาธารณะ)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT f.*, c.name AS category_name, c.icon AS category_icon, c.color AS category_color, c.bg_color AS category_bg
       FROM foods f LEFT JOIN categories c ON c.id = f.category_id
       WHERE f.id = ? AND f.is_active = 1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'ไม่พบรายการอาหาร' });
    res.json({ success: true, data: { ...rows[0], benefits: parseJson(rows[0].benefits) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/foods — เพิ่มอาหาร (Admin) + อัปโหลดรูป
router.post('/', verify, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, category_id, calories, protein, carbs, fat, benefits, is_featured, emoji, bg_color } = req.body;
    if (!title?.trim() || !category_id)
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่ออาหารและหมวดหมู่' });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const bJson    = Array.isArray(benefits) ? JSON.stringify(benefits) : (benefits || '[]');

    const [result] = await db.execute(
      `INSERT INTO foods (title, subtitle, description, category_id, calories, protein, carbs, fat,
                          benefits, image_url, emoji, bg_color, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), subtitle || '', description || '', category_id,
       calories || 0, protein || 0, carbs || 0, fat || 0,
       bJson, imageUrl, emoji || '🥗', bg_color || '#f0fdf4', is_featured === 'true' || is_featured === true ? 1 : 0]
    );
    const [newRow] = await db.execute('SELECT * FROM foods WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: { ...newRow[0], benefits: parseJson(newRow[0].benefits) }, message: 'เพิ่มข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/foods/:id — แก้ไขอาหาร (Admin) + รูปใหม่ถ้ามี
router.put('/:id', verify, upload.single('image'), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'ไม่พบรายการ' });
    const old = rows[0];

    // ถ้ามีรูปใหม่ ลบรูปเก่า
    let imageUrl = old.image_url;
    if (req.file) {
      if (old.image_url) {
        const oldPath = path.join(__dirname, '..', old.image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const { title, subtitle, description, category_id, calories, protein, carbs, fat, benefits, is_featured, emoji, bg_color } = req.body;
    const bJson = benefits ? (Array.isArray(benefits) ? JSON.stringify(benefits) : benefits) : old.benefits;

    await db.execute(
      `UPDATE foods SET
        title       = COALESCE(?, title),
        subtitle    = COALESCE(?, subtitle),
        description = COALESCE(?, description),
        category_id = COALESCE(?, category_id),
        calories    = COALESCE(?, calories),
        protein     = COALESCE(?, protein),
        carbs       = COALESCE(?, carbs),
        fat         = COALESCE(?, fat),
        benefits    = ?,
        image_url   = ?,
        emoji       = COALESCE(?, emoji),
        bg_color    = COALESCE(?, bg_color),
        is_featured = ?,
        updated_at  = NOW()
       WHERE id = ?`,
      [title || null, subtitle || null, description || null, category_id || null,
       calories ?? null, protein ?? null, carbs ?? null, fat ?? null,
       bJson, imageUrl, emoji || null, bg_color || null,
       is_featured === 'true' || is_featured === true ? 1 : 0,
       req.params.id]
    );
    const [updated] = await db.execute('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: { ...updated[0], benefits: parseJson(updated[0].benefits) }, message: 'แก้ไขสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/foods/:id — ลบอาหาร (Admin)
router.delete('/:id', verify, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT image_url FROM foods WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'ไม่พบรายการ' });

    // ลบไฟล์รูปถ้ามี
    if (rows[0].image_url) {
      const imgPath = path.join(__dirname, '..', rows[0].image_url);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await db.execute('DELETE FROM foods WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
