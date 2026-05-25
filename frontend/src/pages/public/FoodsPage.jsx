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
    ]).then(([fRes, cRes]) => { setFoods(fRes.data.data); setCats(cRes.data.data); })
     .finally(() => setLoading(false));
  }, [catFilter, search]);

  const catMap = Object.fromEntries(cats.map(c => [c.id, c]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-1">อาหารเพื่อสุขภาพ</h1>
        <p className="text-gray-400 text-sm sm:text-base">ค้นพบสารอาหารและประโยชน์ของอาหารแต่ละชนิด</p>
      </div>

      {/* Search + filter */}
      {/* mobile: stack / md+: row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาอาหาร..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"/>
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                     focus:outline-none focus:border-primary bg-white
                     sm:w-48 md:w-56">
          <option value="">ทุกหมวดหมู่</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Category chips — scroll on mobile, wrap on md+ */}
      {cats.length > 0 && (
        <div className="flex gap-2
                        overflow-x-auto md:flex-wrap
                        pb-2 mb-5 scrollbar-none
                        -mx-4 px-4 sm:mx-0 sm:px-0">
          <button onClick={() => setCatFilter('')}
            className={`flex-shrink-0 px-3 md:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors
                        ${!catFilter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            ทั้งหมด ({foods.length})
          </button>
          {cats.map(c => (
            <button key={c.id} onClick={() => setCatFilter(String(c.id))}
              className={`flex-shrink-0 px-3 md:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors
                          ${catFilter === String(c.id) ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              style={catFilter === String(c.id) ? { background: c.color } : {}}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? <Spinner/> : foods.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-base">ไม่พบข้อมูลที่ค้นหา</p>
          <button onClick={() => { setSearch(''); setCatFilter(''); }}
            className="mt-4 text-sm text-primary font-semibold hover:underline">ล้างการค้นหา</button>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">พบ {foods.length} รายการ</p>
          {/* mobile:2  md:3  lg:4 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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
