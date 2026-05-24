// src/pages/public/FoodDetailPage.jsx — Mobile First
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById } from '../../utils/api';
import { Spinner } from '../../components/index';

export default function FoodDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [food,    setFood]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getFoodById(id)
      .then(res => setFood(res.data.data))
      .catch(() => setError('ไม่พบรายการอาหาร'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><Spinner/></div>;
  if (error || !food) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-500 mb-4">{error}</p>
      <button onClick={() => navigate('/foods')} className="text-primary font-semibold hover:underline">← กลับ</button>
    </div>
  );

  const benefits = Array.isArray(food.benefits) ? food.benefits : JSON.parse(food.benefits || '[]');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary border border-primary px-3 sm:px-4 py-2 rounded-full hover:bg-primary-xlight transition-colors mb-6 sm:mb-8">
        ← กลับ
      </button>

      {/* Mobile: stack layout / Desktop: side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 items-start">

        {/* ── Image + Nutrition (left on desktop, top on mobile) ── */}
        <div className="md:col-span-2 space-y-4">
          {/* Image */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center"
               style={{ background: food.bg_color || '#f0fdf4', aspectRatio: '1' }}>
            {food.image_url
              ? <img src={food.image_url} alt={food.title} className="w-full h-full object-cover"/>
              : <span style={{ fontSize: 80 }}>{food.emoji || '🥗'}</span>
            }
          </div>

          {/* Nutrition card */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-3">
              ข้อมูลโภชนาการ (ต่อ 100g)
            </h3>
            {/* Mobile: 2x2 grid / Desktop: list */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-0">
              {[
                ['🔥 แคลอรี',       food.calories, 'kcal'],
                ['💪 โปรตีน',       food.protein,  'g'],
                ['🌾 คาร์โบไฮเดรต', food.carbs,    'g'],
                ['🥑 ไขมัน',        food.fat,      'g'],
              ].map(([l, v, u]) => (
                <div key={l}
                  className="sm:flex sm:justify-between sm:py-2.5 sm:border-b sm:border-gray-50 sm:last:border-0
                             flex flex-col items-center bg-gray-50 sm:bg-transparent rounded-xl sm:rounded-none p-3 sm:p-0">
                  <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">{l}</span>
                  <span className="text-sm sm:text-sm font-bold text-gray-800 mt-0.5 sm:mt-0">{Number(v).toFixed(1)} {u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detail (right on desktop, bottom on mobile) ── */}
        <div className="md:col-span-3">
          {food.category_name && (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: food.category_bg, color: food.category_color }}>
              {food.category_icon} {food.category_name}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{food.title}</h1>
          <p className="text-gray-500 text-base sm:text-lg mb-5">{food.subtitle}</p>

          {food.description && (
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6 bg-gray-50 rounded-2xl p-4 sm:p-5">
              {food.description}
            </p>
          )}

          {benefits.length > 0 && (
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-3">💚 ประโยชน์ต่อสุขภาพ</h3>
              <div className="flex flex-wrap gap-2">
                {benefits.map((b, i) => (
                  <span key={i} className="bg-primary-xlight text-primary font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {food.is_featured === 1 && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-amber-700 font-medium">
              ⭐ รายการแนะนำโดย NutriSite
            </div>
          )}

          {/* Back to list button — mobile only bottom */}
          <button onClick={() => navigate('/foods')}
            className="mt-6 w-full sm:w-auto px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary-xlight transition-colors text-sm text-center block md:hidden">
            ← ดูรายการอื่น
          </button>
        </div>
      </div>
    </div>
  );
}
