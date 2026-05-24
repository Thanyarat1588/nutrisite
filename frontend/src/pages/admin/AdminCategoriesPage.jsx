// src/pages/admin/AdminCategoriesPage.jsx — Mobile First
import { useState, useEffect } from 'react';
import { getCategories, getFoods, createCategory, updateCategory, deleteCategory } from '../../utils/api';
import { Spinner } from '../../components/index';
import toast from 'react-hot-toast';

const CAT_ICONS  = ['📂','🥗','🥩','🌾','🥑','🌱','🍵','🍎','🥦','🫐','🥕','🧄','🫒','🍇','🥝'];
const CAT_THEMES = [
  { color:'#22c55e',bg:'#f0fdf4' },{ color:'#f97316',bg:'#fff7ed' },
  { color:'#d97706',bg:'#fffbeb' },{ color:'#14b8a6',bg:'#f0fdfa' },
  { color:'#8b5cf6',bg:'#f5f3ff' },{ color:'#3b82f6',bg:'#eff6ff' },
  { color:'#ec4899',bg:'#fdf2f8' },{ color:'#ef4444',bg:'#fef2f2' },
];
const EMPTY = { name:'',description:'',icon:'📂',color:'#22c55e',bg_color:'#f0fdf4',sort_order:0 };

export default function AdminCategoriesPage() {
  const [cats,    setCats]    = useState([]);
  const [foods,   setFoods]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getCategories(), getFoods({ limit: 999 })])
      .then(([cRes, fRes]) => { setCats(cRes.data.data); setFoods(fRes.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setModal('new'); };
  const openEdit = (c) => { setForm({ name:c.name,description:c.description||'',icon:c.icon,color:c.color,bg_color:c.bg_color,sort_order:c.sort_order||0 }); setModal(c); };
  const setF     = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('กรุณาระบุชื่อหมวดหมู่');
    setSaving(true);
    try {
      if (modal === 'new') { await createCategory(form); toast.success('เพิ่มหมวดหมู่สำเร็จ'); }
      else                 { await updateCategory(modal.id, form); toast.success('แก้ไขสำเร็จ'); }
      load(); setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'บันทึกไม่สำเร็จ'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (cat) => {
    try { await deleteCategory(cat.id); toast.success('ลบสำเร็จ'); setConfirm(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'ลบไม่สำเร็จ'); }
  };

  return (
    <div>
      {/* Confirm */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-base mb-2">ยืนยันการลบ</h3>
            <p className="text-gray-500 text-sm mb-1">ลบหมวดหมู่ "{confirm.name}"?</p>
            {foods.filter(f => f.category_id === confirm.id).length > 0 && (
              <p className="text-red-500 text-xs mt-1 mb-3">⚠️ มีอาหาร {foods.filter(f => f.category_id === confirm.id).length} รายการในหมวดนี้</p>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 border border-gray-200 font-semibold rounded-xl text-sm">ยกเลิก</button>
              <button onClick={() => handleDelete(confirm)} className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm">ลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
             onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
              <h2 className="font-bold text-base sm:text-lg">{modal === 'new' ? 'เพิ่มหมวดหมู่' : 'แก้ไขหมวดหมู่'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {/* Preview */}
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: form.bg_color }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: form.bg_color, filter:'brightness(0.93)' }}>{form.icon}</div>
                <div>
                  <p className="font-bold text-sm" style={{ color: form.color }}>{form.name || 'ชื่อหมวดหมู่'}</p>
                  <p className="text-xs text-gray-400">{form.description || 'คำอธิบาย'}</p>
                </div>
              </div>
              {/* Icon */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ไอคอน</label>
                <div className="flex flex-wrap gap-2">
                  {CAT_ICONS.map(e => (
                    <button key={e} onClick={() => setF('icon', e)}
                      className={`text-2xl p-2 rounded-xl ${form.icon === e ? 'bg-primary-xlight ring-2 ring-primary' : 'hover:bg-gray-100'}`}>{e}</button>
                  ))}
                </div>
              </div>
              {/* Themes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ธีมสี</label>
                <div className="flex flex-wrap gap-2">
                  {CAT_THEMES.map(t => (
                    <button key={t.color} onClick={() => { setF('color',t.color); setF('bg_color',t.bg); }}
                      className={`w-9 h-9 rounded-xl ${form.color === t.color ? 'ring-2 ring-offset-1 ring-gray-700 scale-110' : ''}`}
                      style={{ background: t.color }}/>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">ชื่อหมวดหมู่ *</label>
                <input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="เช่น ผักและผลไม้"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">คำอธิบาย</label>
                <input value={form.description} onChange={e => setF('description', e.target.value)} placeholder="อธิบายหมวดหมู่..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4 border-t sticky bottom-0 bg-white">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">ยกเลิก</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60">
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900">จัดการหมวดหมู่</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{cats.length} หมวดหมู่</p>
        </div>
        <button onClick={openNew}
          className="px-3 sm:px-5 py-2 sm:py-2.5 bg-primary text-white font-semibold rounded-xl text-xs sm:text-sm whitespace-nowrap hover:bg-primary-dark">
          + เพิ่มหมวดหมู่
        </button>
      </div>

      {loading ? <Spinner/> : (
        <>
          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {cats.map(c => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: c.bg_color }}>{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.description}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary-xlight text-primary shrink-0">
                    {foods.filter(f => f.category_id === c.id).length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="flex-1 py-2 border border-primary text-primary text-xs font-semibold rounded-xl">✏️ แก้ไข</button>
                  <button onClick={() => setConfirm(c)} className="flex-1 py-2 border border-red-300 text-red-500 text-xs font-semibold rounded-xl">🗑️ ลบ</button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>{['หมวดหมู่','คำอธิบาย','จำนวนอาหาร','จัดการ'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cats.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: c.bg_color }}>{c.icon}</div>
                        <span className="font-semibold text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{c.description}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-xlight text-primary">
                        {foods.filter(f => f.category_id === c.id).length} รายการ
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="px-3 py-1.5 border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-primary-xlight">แก้ไข</button>
                        <button onClick={() => setConfirm(c)} className="px-3 py-1.5 border border-red-300 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50">ลบ</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
