// src/pages/admin/AdminSettingsPage.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('nutrisite_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ hero_image: null, hero_title: '', hero_subtitle: '' });
  const [preview,  setPreview]  = useState(null);
  const [file,     setFile]     = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);
  const fileRef = useRef();

  useEffect(() => {
    api.get('/settings').then(res => {
      const d = res.data.data;
      setSettings(d);
      if (d.hero_image) setPreview(d.hero_image);
    }).finally(() => setLoading(false));
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
  };

  const removeImage = async () => {
    try {
      await api.delete('/settings/hero-image');
      setPreview(null);
      setFile(null);
      setSettings(s => ({ ...s, hero_image: null }));
      toast.success('ลบรูปแล้ว');
    } catch { toast.error('ลบรูปไม่สำเร็จ'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append('hero_image', file);
      fd.append('hero_title',    settings.hero_title    || '');
      fd.append('hero_subtitle', settings.hero_subtitle || '');
      const res = await api.put('/settings', fd);
      setSettings(res.data.data);
      setFile(null);
      toast.success('บันทึกการตั้งค่าสำเร็จ');
    } catch { toast.error('บันทึกไม่สำเร็จ'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary-xlight border-t-primary rounded-full animate-spin"/></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">ตั้งค่าหน้าเว็บ</h1>
        <p className="text-gray-400 text-sm mt-1">แก้ไขภาพและข้อความใน Hero Section ของหน้าแรก</p>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 mb-6 border border-green-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">ตัวอย่างการแสดงผล</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-display text-2xl font-bold text-gray-900 leading-tight">{settings.hero_title || 'กินดี ชีวิตยืนยาว'}</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{settings.hero_subtitle || 'รวบรวมความรู้เรื่องอาหารเพื่อสุขภาพ'}</p>
          </div>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
               style={{ background: '#f0fdf4' }}>
            {preview
              ? <img src={preview} alt="Hero" className="w-full h-full object-cover"/>
              : <span className="text-4xl">🥗</span>
            }
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* Hero Image Upload */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            ภาพหน้าแรก (Hero Image)
          </label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>

          {preview ? (
            <div className="relative group">
              <img src={preview} alt="Hero preview"
                className="w-full h-56 object-cover rounded-2xl border border-gray-100"/>
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => fileRef.current.click()}
                  className="px-4 py-2 bg-white text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-50">
                  🔄 เปลี่ยนรูป
                </button>
                <button onClick={removeImage}
                  className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600">
                  🗑️ ลบรูป
                </button>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                hover เพื่อแก้ไข
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-primary hover:bg-primary-xlight transition-all">
              <div className="text-4xl mb-3">🖼️</div>
              <p className="font-semibold text-gray-600 mb-1">คลิกหรือลากไฟล์มาวางที่นี่</p>
              <p className="text-sm text-gray-400">JPG, PNG, GIF, WEBP — สูงสุด 5MB</p>
              <p className="text-xs text-gray-300 mt-1">แนะนำขนาด 800×600px ขึ้นไป</p>
            </div>
          )}
        </div>

        {/* Hero Title */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
            ข้อความหัวเรื่อง
          </label>
          <input
            value={settings.hero_title || ''}
            onChange={e => setSettings(s => ({ ...s, hero_title: e.target.value }))}
            placeholder="เช่น กินดี ชีวิตยืนยาว"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Hero Subtitle */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
            ข้อความรอง
          </label>
          <textarea
            value={settings.hero_subtitle || ''}
            onChange={e => setSettings(s => ({ ...s, hero_subtitle: e.target.value }))}
            rows={3}
            placeholder="เช่น รวบรวมความรู้เรื่องอาหารเพื่อสุขภาพ..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
          />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60">
          {saving ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
        </button>
      </div>
    </div>
  );
}
