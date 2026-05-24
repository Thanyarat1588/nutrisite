// src/pages/admin/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { getFoods, getCategories } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/index';

export default function DashboardPage() {
  const [foods,   setFoods]   = useState([]);
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();

  useEffect(() => {
    Promise.all([getFoods({ limit: 200 }), getCategories()])
      .then(([fRes, cRes]) => { setFoods(fRes.data.data); setCats(cRes.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: '🥗', label: 'รายการอาหาร',    value: foods.length,                    bg: 'bg-green-50',  text: 'text-green-700' },
    { icon: '📂', label: 'หมวดหมู่',        value: cats.length,                     bg: 'bg-blue-50',   text: 'text-blue-700' },
    { icon: '⭐', label: 'รายการแนะนำ',     value: foods.filter(f=>f.is_featured===1).length, bg: 'bg-amber-50', text: 'text-amber-700' },
    { icon: '👤', label: 'แอดมิน',          value: 1,                               bg: 'bg-purple-50', text: 'text-purple-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          สวัสดี, {admin?.display_name || admin?.username} 👋
        </h1>
        <p className="text-gray-400 mt-1">ภาพรวมระบบ NutriSite วันนี้</p>
      </div>

      {loading ? <Spinner/> : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`font-display text-3xl font-bold ${s.text}`}>{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Category breakdown */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">📂 อาหารในแต่ละหมวดหมู่</h2>
              <div className="space-y-3">
                {cats.map(c => {
                  const count = foods.filter(f => f.category_id === c.id).length;
                  const pct   = foods.length ? Math.round((count / foods.length) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{c.icon} {c.name}</span>
                        <span className="text-gray-400">{count} รายการ ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.color }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Latest foods */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">🕒 รายการล่าสุด</h2>
              <div className="space-y-3">
                {foods.slice(0, 6).map(f => {
                  const cat = cats.find(c => c.id === f.category_id);
                  return (
                    <div key={f.id} className="flex items-center gap-3">
                      <span className="text-2xl">{f.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{f.title}</p>
                        <p className="text-xs text-gray-400">{cat?.name}</p>
                      </div>
                      {f.is_featured === 1 && <span className="text-amber-400 text-sm">⭐</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
