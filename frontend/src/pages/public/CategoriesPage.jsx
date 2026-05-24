// src/pages/public/CategoriesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../utils/api';
import { Spinner } from '../../components/index';

export default function CategoriesPage() {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then(res => setCats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">หมวดหมู่อาหาร</h1>
        <p className="text-gray-400">เลือกดูอาหารตามหมวดหมู่ที่สนใจ</p>
      </div>

      {loading ? <Spinner/> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map(c => (
            <div key={c.id} onClick={() => navigate(`/foods?category=${c.id}`)}
              className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer
                         hover:-translate-y-1 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                     style={{ background: c.bg_color }}>
                  {c.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">{c.name}</h2>
                  <span className="text-sm font-semibold" style={{ color: c.color }}>
                    {c.food_count} รายการ
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{c.description}</p>
              <div className="mt-4 text-sm font-semibold transition-colors"
                   style={{ color: c.color }}>
                ดูรายการ →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
