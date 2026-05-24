// src/pages/public/FoodsPage.jsx — Mobile First
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFoods, getCategories } from '../../utils/api';
import { FoodCard, Spinner } from '../../components/index';

export default function FoodsPage() {
  const [foods,     setFoods]     = useState([]);
  const [cats,      setCats]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [params]                  = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => { const c = params.get('category'); if (c) setCatFilter(c); }, [params]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFoods({ category_id: catFilter || undefined, search: search || undefined, limit: 100 }),
      getCategories(),
    ]).then(([fRes, cRes]) => {
      setFoods(fRes.data.data);
      setCats(cRes.data.data);
    }).finally(() => setLoading(false));
  }, [catFilter, search]);

  const catMap = Object.fromEntries(cats.map(c => [c.id, c]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">อาหารเพื่อสุขภาพ</h1>
        <p className="text-gray-400 text-sm sm:text-base">ค้นพบสารอาหารและประโยชน์ของอาหารแต่ละชนิด</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาอาหาร..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"/>
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary bg-white max-w-[140px] sm:max-w-[180px]">
          <option value="">ทุกหมวดหมู่</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Category chips — horizontal scroll on mobile */}
      {cats.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button onClick={() => setCatFilter('')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${!catFilter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
            ทั้งหมด ({foods.length})
          </button>
          {cats.map(c => (
            <button key={c.id} onClick={() => setCatFilter(String(c.id))}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${catFilter === String(c.id) ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
              style={catFilter === String(c.id) ? { background: c.color } : {}}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? <Spinner/> : foods.length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-base sm:text-lg">ไม่พบข้อมูลที่ค้นหา</p>
          <button onClick={() => { setSearch(''); setCatFilter(''); }}
            className="mt-4 text-sm text-primary font-semibold hover:underline">ล้างการค้นหา</button>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">พบ {foods.length} รายการ</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {foods.map(f => (
              <FoodCard key={f.id} food={f} category={catMap[f.category_id]}
                onClick={() => navigate(`/foods/${f.id}`)}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
