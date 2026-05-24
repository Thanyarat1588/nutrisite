-- ============================================================
-- database/schema.sql  — สร้างฐานข้อมูล NutriSite
-- ============================================================
-- วิธีใช้: mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS nutrisite_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE nutrisite_db;

-- ─── ตาราง admins ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT          NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(100) NOT NULL DEFAULT '',
  role          ENUM('superadmin','admin') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login    DATETIME         NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_username (username)
) ENGINE=InnoDB;

-- ─── ตาราง categories ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  description TEXT             NULL,
  icon        VARCHAR(10)  NOT NULL DEFAULT '📂',
  color       VARCHAR(20)  NOT NULL DEFAULT '#22c55e',
  bg_color    VARCHAR(20)  NOT NULL DEFAULT '#f0fdf4',
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ─── ตาราง foods ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS foods (
  id            INT           NOT NULL AUTO_INCREMENT,
  category_id   INT           NOT NULL,
  title         VARCHAR(150)  NOT NULL,
  subtitle      VARCHAR(255)      NULL,
  description   TEXT              NULL,
  calories      DECIMAL(7,2) NOT NULL DEFAULT 0,
  protein       DECIMAL(7,2) NOT NULL DEFAULT 0,
  carbs         DECIMAL(7,2) NOT NULL DEFAULT 0,
  fat           DECIMAL(7,2) NOT NULL DEFAULT 0,
  benefits      JSON              NULL  COMMENT 'JSON array of benefit strings',
  image_url     VARCHAR(255)      NULL,
  emoji         VARCHAR(10)  NOT NULL DEFAULT '🥗',
  bg_color      VARCHAR(20)  NOT NULL DEFAULT '#f0fdf4',
  is_featured   TINYINT(1)   NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_food_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_category  (category_id),
  INDEX idx_featured  (is_featured),
  INDEX idx_active    (is_active),
  FULLTEXT INDEX ft_title (title, subtitle)
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA (ข้อมูลเริ่มต้น)
-- ============================================================

-- Admin เริ่มต้น: username=admin  password=admin1234
-- (bcrypt hash ของ "admin1234" rounds=12)
INSERT INTO admins (username, password_hash, display_name, role) VALUES
('admin', '$2a$12$9z0kLbJBJyvKGXy3H7FRHe7bqfx2MQ5CZnLQRSOgRVFLCrTfuPKpq', 'ผู้ดูแลระบบ', 'superadmin');

-- Categories
INSERT INTO categories (name, description, icon, color, bg_color, sort_order) VALUES
('ผักและผลไม้',        'อุดมด้วยวิตามินและแร่ธาตุ',               '🥗', '#22c55e', '#f0fdf4', 1),
('โปรตีนจากเนื้อสัตว์','เหมาะสำหรับการสร้างกล้ามเนื้อ',          '🥩', '#f97316', '#fff7ed', 2),
('ธัญพืชและไฟเบอร์',   'อุดมด้วยใยอาหารและพลังงานคงทน',          '🌾', '#d97706', '#fffbeb', 3),
('ไขมันดี',            'ดีต่อสุขภาพหัวใจและสมอง',                '🥑', '#14b8a6', '#f0fdfa', 4),
('โปรตีนจากพืช',       'โปรตีนทางเลือกสำหรับมังสวิรัติ',         '🌱', '#8b5cf6', '#f5f3ff', 5),
('เครื่องดื่มสุขภาพ',   'เครื่องดื่มที่มีประโยชน์ต่อร่างกาย',     '🍵', '#3b82f6', '#eff6ff', 6);

-- Foods
INSERT INTO foods (category_id, title, subtitle, description, calories, protein, carbs, fat, benefits, emoji, bg_color, is_featured) VALUES
(1,  'บล็อคโคลี่',  'ราชาแห่งผักสุขภาพ',
 'บล็อคโคลี่เต็มไปด้วยวิตามิน C K และ B9 มีสารต้านมะเร็ง sulforaphane อุดมด้วยใยอาหาร',
 34, 3, 7, 0.4, JSON_ARRAY('ต้านมะเร็ง','เสริมภูมิคุ้มกัน','บำรุงกระดูก'), '🥦', '#f0fdf4', 1),

(1,  'สลัดผักสด',   'รวมวิตามินครบ',
 'สลัดผักสดรวมเป็นแหล่งวิตามินแร่ธาตุและใยอาหารที่ดีเยี่ยม แคลอรีต่ำ',
 20, 2, 4, 0.3, JSON_ARRAY('แคลอรีต่ำ','ย่อยง่าย','เสริมภูมิคุ้มกัน'), '🥗', '#f0fdf4', 1),

(2,  'แซลมอนย่าง',  'อุดมด้วยโอเมก้า-3',
 'ปลาแซลมอนย่างเป็นแหล่งโปรตีนคุณภาพสูงและกรดไขมันโอเมก้า-3 ที่ดีต่อสุขภาพหัวใจและสมอง',
 208, 20, 0, 13, JSON_ARRAY('บำรุงสมอง','ลดการอักเสบ','ดีต่อหัวใจ'), '🐟', '#fef9c3', 1),

(2,  'ไข่ไก่',      'โปรตีนครบถ้วน',
 'ไข่ไก่เป็นแหล่งโปรตีนที่สมบูรณ์แบบ มีกรดอะมิโนครบทุกชนิด อุดมด้วยวิตามิน D และโคลีน',
 155, 13, 1, 11, JSON_ARRAY('สร้างกล้ามเนื้อ','บำรุงสมอง','ให้พลังงาน'), '🥚', '#fefce8', 0),

(3,  'ข้าวโอ๊ต',    'ธัญพืชแห่งพลังงาน',
 'ข้าวโอ๊ตเป็นแหล่งคาร์โบไฮเดรตเชิงซ้อนและเบต้า-กลูแคน ช่วยลดคอเลสเตอรอล อิ่มนาน',
 389, 17, 66, 7, JSON_ARRAY('อิ่มนาน','ลดคอเลสเตอรอล','ควบคุมน้ำตาล'), '🌾', '#fffbeb', 0),

(4,  'อะโวคาโด',    'ไขมันดีแบบครบครัน',
 'อะโวคาโดอุดมด้วยไขมันไม่อิ่มตัวเชิงเดี่ยว โพแทสเซียม วิตามิน K E C ช่วยดูดซึมสารอาหาร',
 160, 2, 9, 15, JSON_ARRAY('บำรุงหัวใจ','ต้านอนุมูลอิสระ','ช่วยลดน้ำหนัก'), '🥑', '#f0fdf4', 1),

(5,  'ถั่วอัลมอนด์', 'ถั่วแห่งสารอาหาร',
 'อุดมด้วยวิตามิน E แมกนีเซียม ไฟเบอร์ และโปรตีน ช่วยลดความดันโลหิต ควบคุมน้ำตาล',
 579, 21, 22, 50, JSON_ARRAY('บำรุงผิว','ควบคุมน้ำตาล','ลดความดัน'), '🥜', '#fef3c7', 0),

(6,  'ชาเขียว',     'เครื่องดื่มต้านอนุมูลอิสระ',
 'ชาเขียวอุดมด้วยสาร EGCG ต้านอนุมูลอิสระสูง เพิ่มการเผาผลาญ ปกป้องสมอง ลดความเสี่ยงโรคเรื้อรัง',
 2, 0, 0, 0, JSON_ARRAY('เพิ่มการเผาผลาญ','ต้านอนุมูลอิสระ','บำรุงสมอง'), '🍵', '#f0fdf4', 1);
