// src/pages/public/FoodsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFoods, getCategories } from '../../utils/api';
import { FoodCard, Spinner } from '../../components/index';

export default function FoodsPage() {
  const [foods,    setFoods]    = useState([]);
  const [cats,     setCats]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState('');
  const [params]                = useSearchParams();
  const navigate = useNavigate();

  // รับ ?category=id จาก URL
  useEffect(() => {
    const c = params.get('category');
    if (c) setCatFilter(c);
  }, [params]);

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">อาหารเพื่อสุขภาพ</h1>
        <p className="text-gray-400">ค้นพบสารอาหารและประโยชน์ของอาหารแต่ละชนิด</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาอาหาร..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white min-w-[180px]">
          <option value="">ทุกหมวดหมู่</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Category chips */}
      {cats.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setCatFilter('')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${!catFilter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            ทั้งหมด
          </button>
          {cats.map(c => (
            <button key={c.id} onClick={() => setCatFilter(String(c.id))}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${catFilter === String(c.id) ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              style={catFilter === String(c.id) ? { background: c.color } : {}}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? <Spinner/> : foods.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">ไม่พบข้อมูลที่ค้นหา</p>
          <button onClick={() => { setSearch(''); setCatFilter(''); }}
            className="mt-4 text-sm text-primary font-semibold hover:underline">
            ล้างการค้นหา
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">พบ {foods.length} รายการ</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
