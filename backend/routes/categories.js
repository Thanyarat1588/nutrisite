// ============================================================
// routes/categories.js — CRUD หมวดหมู่อาหาร
// ============================================================
const express = require('express');
const db      = require('../config/db');
const verify  = require('../middleware/auth');
const router  = express.Router();

// GET /api/categories — ดูหมวดหมู่ทั้งหมด (สาธารณะ)
router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT c.*, COUNT(f.id) AS food_count
      FROM categories c
      LEFT JOIN foods f ON f.category_id = c.id AND f.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/categories/:id — ดูหมวดหมู่เดียว (สาธารณะ)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories — เพิ่มหมวดหมู่ (Admin)
router.post('/', verify, async (req, res) => {
  try {
    const { name, description, icon, color, bg_color, sort_order = 0 } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'กรุณาระบุชื่อหมวดหมู่' });

    const [result] = await db.execute(
      'INSERT INTO categories (name, description, icon, color, bg_color, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), description || '', icon || '📂', color || '#22c55e', bg_color || '#f0fdf4', sort_order]
    );
    const [newRow] = await db.execute('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newRow[0], message: 'เพิ่มหมวดหมู่สำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/categories/:id — แก้ไขหมวดหมู่ (Admin)
router.put('/:id', verify, async (req, res) => {
  try {
    const { name, description, icon, color, bg_color, sort_order } = req.body;
    const [check] = await db.execute('SELECT id FROM categories WHERE id = ?', [req.params.id]);
    if (!check.length) return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่' });

    await db.execute(
      `UPDATE categories SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        icon = COALESCE(?, icon),
        color = COALESCE(?, color),
        bg_color = COALESCE(?, bg_color),
        sort_order = COALESCE(?, sort_order),
        updated_at = NOW()
       WHERE id = ?`,
      [name || null, description || null, icon || null, color || null, bg_color || null, sort_order ?? null, req.params.id]
    );
    const [updated] = await db.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0], message: 'แก้ไขหมวดหมู่สำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/categories/:id — ลบหมวดหมู่ (Admin)
router.delete('/:id', verify, async (req, res) => {
  try {
    const [foods] = await db.execute(
      'SELECT COUNT(*) AS cnt FROM foods WHERE category_id = ?', [req.params.id]
    );
    if (foods[0].cnt > 0)
      return res.status(400).json({ success: false, message: `มีอาหาร ${foods[0].cnt} รายการในหมวดนี้ กรุณาย้ายก่อนลบ` });

    await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'ลบหมวดหมู่สำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
