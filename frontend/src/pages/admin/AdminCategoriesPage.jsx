// src/pages/admin/AdminCategoriesPage.jsx
import { useState, useEffect } from 'react';
import { getCategories, getFoods, createCategory, updateCategory, deleteCategory } from '../../utils/api';
import { Spinner } from '../../components/index';
import toast from 'react-hot-toast';

const CAT_ICONS  = ['📂','🥗','🥩','🌾','🥑','🌱','🍵','🍎','🥦','🫐','🥕','🧄','🫒','🍇','🥝'];
const CAT_THEMES = [
  { color:'#22c55e', bg:'#f0fdf4' }, { color:'#f97316', bg:'#fff7ed' },
  { color:'#d97706', bg:'#fffbeb' }, { color:'#14b8a6', bg:'#f0fdfa' },
  { color:'#8b5cf6', bg:'#f5f3ff' }, { color:'#3b82f6', bg:'#eff6ff' },
  { color:'#ec4899', bg:'#fdf2f8' }, { color:'#ef4444', bg:'#fef2f2' },
];
const EMPTY_FORM = { name:'', description:'', icon:'📂', color:'#22c55e', bg_color:'#f0fdf4', sort_order:0 };

export default function AdminCategoriesPage() {
  const [cats,    setCats]    = useState([]);
  const [foods,   setFoods]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);  // null | 'new' | category object
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [confirm, setConfirm] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getCategories(), getFoods({ limit: 999 })])
      .then(([cRes, fRes]) => { setCats(cRes.data.data); setFoods(fRes.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY_FORM); setModal('new'); };
  const openEdit = (c)  => { setForm({ name: c.name, description: c.description||'', icon: c.icon, color: c.color, bg_color: c.bg_color, sort_order: c.sort_order||0 }); setModal(c); };
  const setF     = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('กรุณาระบุชื่อหมวดหมู่');
    setSaving(true);
    try {
      if (modal === 'new') {
        await createCategory(form);
        toast.success('เพิ่มหมวดหมู่สำเร็จ');
      } else {
        await updateCategory(modal.id, form);
        toast.success('แก้ไขสำเร็จ');
      }
      load();
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    try {
      await deleteCategory(cat.id);
      toast.success('ลบหมวดหมู่สำเร็จ');
      setConfirm(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'ลบไม่สำเร็จ');
    }
  };

  return (
    <div>
      {/* Confirm Modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setConfirm(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-lg mb-2">ยืนยันการลบ</h3>
            <p className="text-gray-500 text-sm mb-1">ลบหมวดหมู่ "{confirm.name}"?</p>
            {foods.filter(f => f.category_id === confirm.id).length > 0 && (
              <p className="text-red-500 text-xs mb-3">
                ⚠️ มีอาหาร {foods.filter(f => f.category_id === confirm.id).length} รายการในหมวดนี้ กรุณาย้ายก่อนลบ
              </p>
            )}
            <div className="flex gap-3 justify-center mt-5">
              <button onClick={() => setConfirm(null)} className="px-5 py-2 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">ยกเลิก</button>
              <button onClick={() => handleDelete(confirm)} className="px-5 py-2 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600">ลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-lg">{modal === 'new' ? 'เพิ่มหมวดหมู่' : 'แก้ไขหมวดหมู่'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: form.bg_color }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: form.bg_color, filter: 'brightness(0.93)' }}>
                  {form.icon}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: form.color }}>{form.name || 'ชื่อหมวดหมู่'}</p>
                  <p className="text-sm text-gray-400">{form.description || 'คำอธิบาย'}</p>
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">ไอคอน</label>
                <div className="flex flex-wrap gap-2">
                  {CAT_ICONS.map(e => (
                    <button key={e} onClick={() => setF('icon', e)}
                      className={`text-2xl p-1.5 rounded-xl transition-all ${form.icon === e ? 'bg-primary-xlight ring-2 ring-primary' : 'hover:bg-gray-100'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">ธีมสี</label>
                <div className="flex flex-wrap gap-2">
                  {CAT_THEMES.map(t => (
                    <button key={t.color} onClick={() => { setF('color', t.color); setF('bg_color', t.bg); }}
                      className={`w-8 h-8 rounded-lg transition-all ${form.color === t.color ? 'ring-2 ring-offset-1 ring-gray-700 scale-110' : 'hover:scale-105'}`}
                      style={{ background: t.color }}/>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">ชื่อหมวดหมู่ *</label>
                <input value={form.name} onChange={e => setF('name', e.target.value)}
                  placeholder="เช่น ผักและผลไม้"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">คำอธิบาย</label>
                <input value={form.description} onChange={e => setF('description', e.target.value)}
                  placeholder="อธิบายหมวดหมู่นี้..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">ลำดับการแสดง</label>
                <input type="number" min="0" value={form.sort_order} onChange={e => setF('sort_order', Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary text-center"/>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setModal(null)} className="px-5 py-2 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">ยกเลิก</button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark disabled:opacity-60">
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">จัดการหมวดหมู่</h1>
          <p className="text-gray-400 text-sm">{cats.length} หมวดหมู่ทั้งหมด</p>
        </div>
        <button onClick={openNew}
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm">
          + เพิ่มหมวดหมู่
        </button>
      </div>

      {/* Table */}
      {loading ? <Spinner/> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['หมวดหมู่', 'คำอธิบาย', 'จำนวนอาหาร', 'ลำดับ', 'จัดการ'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cats.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                           style={{ background: c.bg_color }}>
                        {c.icon}
                      </div>
                      <span className="font-semibold text-sm text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{c.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-xlight text-primary">
                      {foods.filter(f => f.category_id === c.id).length} รายการ
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)}
                        className="px-3 py-1.5 border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-primary-xlight transition-colors">
                        แก้ไข
                      </button>
                      <button onClick={() => setConfirm(c)}
                        className="px-3 py-1.5 border border-red-300 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors">
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cats.length === 0 && <div className="text-center py-12 text-gray-400">ยังไม่มีหมวดหมู่</div>}
        </div>
      )}
    </div>
  );
}
