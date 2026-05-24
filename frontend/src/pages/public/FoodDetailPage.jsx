// src/pages/public/FoodDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById } from '../../utils/api';
import { Spinner } from '../../components/index';

export default function FoodDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [food, setFood]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getFoodById(id)
      .then(res => setFood(res.data.data))
      .catch(() => setError('ไม่พบรายการอาหาร'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-10"><Spinner/></div>;
  if (error || !food) return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-500 mb-4">{error}</p>
      <button onClick={() => navigate('/foods')} className="text-primary font-semibold hover:underline">← กลับ</button>
    </div>
  );

  const benefits = Array.isArray(food.benefits) ? food.benefits : JSON.parse(food.benefits || '[]');

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary-xlight transition-colors mb-8">
        ← กลับ
      </button>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* ── Left: image + nutrition ── */}
        <div className="md:col-span-2">
          <div className="rounded-3xl overflow-hidden aspect-square flex items-center justify-center mb-6"
               style={{ background: food.bg_color || '#f0fdf4' }}>
            {food.image_url
              ? <img src={food.image_url} alt={food.title} className="w-full h-full object-cover"/>
              : <span style={{ fontSize: 90 }}>{food.emoji || '🥗'}</span>
            }
          </div>

          {/* Nutrition card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wide mb-4">
              ข้อมูลโภชนาการ (ต่อ 100g)
            </h3>
            {[
              ['🔥 แคลอรี',       food.calories, 'kcal'],
              ['💪 โปรตีน',       food.protein,  'g'],
              ['🌾 คาร์โบไฮเดรต', food.carbs,    'g'],
              ['🥑 ไขมัน',        food.fat,      'g'],
            ].map(([l, v, u]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{l}</span>
                <span className="text-sm font-bold text-gray-800">{Number(v).toFixed(1)} {u}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: details ── */}
        <div className="md:col-span-3">
          {food.category_name && (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: food.category_bg, color: food.category_color }}>
              {food.category_icon} {food.category_name}
            </span>
          )}
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">{food.title}</h1>
          <p className="text-gray-500 text-lg mb-6">{food.subtitle}</p>

          {food.description && (
            <p className="text-gray-600 leading-relaxed text-base mb-8 bg-gray-50 rounded-2xl p-5">
              {food.description}
            </p>
          )}

          {benefits.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">💚 ประโยชน์ต่อสุขภาพ</h3>
              <div className="flex flex-wrap gap-2">
                {benefits.map((b, i) => (
                  <span key={i}
                    className="bg-primary-xlight text-primary font-medium px-4 py-2 rounded-full text-sm">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {food.is_featured === 1 && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium">
              ⭐ รายการแนะนำโดย NutriSite
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
