import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../utils/api';
import { Spinner } from '../../components/index';

export default function CategoriesPage() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(res => setCats(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      <div className="mb-7 sm:mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-1">หมวดหมู่อาหาร</h1>
        <p className="text-gray-400 text-sm sm:text-base">เลือกดูอาหารตามหมวดหมู่ที่สนใจ</p>
      </div>

      {loading ? <Spinner/> : (
        /* mobile:1  sm:2  lg:3 */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {cats.map(c => (
            <div key={c.id} onClick={() => navigate(`/foods?category=${c.id}`)}
              className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 cursor-pointer
                         hover:-translate-y-1 hover:shadow-lg transition-all active:scale-95 group">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center
                                text-2xl sm:text-3xl shrink-0"
                     style={{ background: c.bg_color }}>
                  {c.icon}
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">{c.name}</h2>
                  <span className="text-xs sm:text-sm font-semibold" style={{ color: c.color }}>
                    {c.food_count} รายการ
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{c.description}</p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold flex items-center gap-1"
                   style={{ color: c.color }}>
                ดูรายการ
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
