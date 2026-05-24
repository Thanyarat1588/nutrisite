// src/pages/admin/AdminLoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return toast.error('กรุณากรอกข้อมูลให้ครบ');
    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success('เข้าสู่ระบบสำเร็จ!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="font-display text-2xl font-bold text-gray-900">เข้าสู่ระบบแอดมิน</h1>
            <p className="text-gray-400 text-sm mt-1">กรอกข้อมูลเพื่อเข้าจัดการระบบ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                ชื่อผู้ใช้
              </label>
              <input
                value={username} onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                รหัสผ่าน
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>

            <div className="bg-green-50 rounded-xl p-3 text-sm text-green-700 border border-green-100">
              💡 ทดสอบ: <strong>admin</strong> / <strong>admin1234</strong>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <button onClick={() => navigate('/')}
            className="w-full mt-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← กลับหน้าเว็บ
          </button>
        </div>
      </div>
    </div>
  );
}
