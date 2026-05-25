import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoods, getCategories } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/index';

export default function DashboardPage() {
  const [foods,   setFoods]   = useState([]);
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    Promise.all([getFoods({ limit: 200 }), getCategories()])
      .then(([fRes, cRes]) => { setFoods(fRes.data.data); setCats(cRes.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon:'🥗', label:'รายการอาหาร',  value:foods.length,                              bg:'bg-green-50',  text:'text-green-700',  link:'/admin/foods'      },
    { icon:'📂', label:'หมวดหมู่',      value:cats.length,                               bg:'bg-blue-50',   text:'text-blue-700',   link:'/admin/categories' },
    { icon:'⭐', label:'รายการแนะนำ',   value:foods.filter(f=>f.is_featured===1).length, bg:'bg-amber-50',  text:'text-amber-700',  link:'/admin/foods'      },
    { icon:'👤', label:'แอดมิน',        value:1,                                         bg:'bg-purple-50', text:'text-purple-700', link:null                },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          สวัสดี, {admin?.display_name || admin?.username} 👋
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">ภาพรวมระบบ NutriSite</p>
      </div>

      {loading ? <Spinner/> : (
        <>
          {/* Stat cards
              mobile: 2 cols
              md:     4 cols  */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map(s => (
              <div key={s.label} onClick={() => s.link && navigate(s.link)}
                className={`${s.bg} rounded-2xl p-4 sm:p-5
                            ${s.link ? 'cursor-pointer hover:shadow-md active:scale-95 transition-all' : ''}`}>
                <div className="text-xl sm:text-2xl mb-2">{s.icon}</div>
                <div className={`font-display text-2xl sm:text-3xl font-bold ${s.text}`}>{s.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Content grid
              mobile: stack
              md:     2 cols  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Category breakdown */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
              <h2 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-4">
                📂 อาหารในแต่ละหมวดหมู่
              </h2>
              <div className="space-y-3">
                {cats.map(c => {
                  const count = foods.filter(f => f.category_id === c.id).length;
                  const pct   = foods.length ? Math.round((count / foods.length) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="font-medium truncate mr-2">{c.icon} {c.name}</span>
                        <span className="text-gray-400 shrink-0">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                             style={{ width:`${pct}%`, background:c.color }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Latest foods */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
              <h2 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-4">
                🕒 รายการล่าสุด
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {foods.slice(0, 6).map(f => {
                  const cat = cats.find(c => c.id === f.category_id);
                  return (
                    <div key={f.id} className="flex items-center gap-3 py-0.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
                           style={{ background: f.bg_color || '#f0fdf4' }}>
                        {f.image_url
                          ? <img src={f.image_url} alt="" className="w-full h-full object-cover rounded-xl"/>
                          : f.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">{f.title}</p>
                        <p className="text-xs text-gray-400">{cat?.name}</p>
                      </div>
                      {f.is_featured === 1 && <span className="text-amber-400 text-sm shrink-0">⭐</span>}
                    </div>
                  );
                })}
              </div>
              <button onClick={() => navigate('/admin/foods')}
                className="mt-4 w-full text-center text-xs sm:text-sm text-primary font-semibold hover:underline">
                ดูทั้งหมด →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
