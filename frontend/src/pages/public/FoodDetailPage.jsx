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
    getFoodById(id).then(res => setFood(res.data.data)).catch(() => setError('ไม่พบรายการ')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><Spinner/></div>;
  if (!food)   return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-500 mb-4">{error}</p>
      <button onClick={() => navigate('/foods')} className="text-primary font-semibold hover:underline">← กลับ</button>
    </div>
  );

  const benefits = Array.isArray(food.benefits) ? food.benefits : JSON.parse(food.benefits || '[]');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary
                   border border-primary px-3 sm:px-4 py-2 rounded-full hover:bg-primary-xlight mb-6 sm:mb-8">
        ← กลับ
      </button>

      {/* mobile: stack / md+: 2-col */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 lg:gap-10">

        {/* Left: image + nutrition */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center"
               style={{ background: food.bg_color || '#f0fdf4', aspectRatio: '1' }}>
            {food.image_url
              ? <img src={food.image_url} alt={food.title} className="w-full h-full object-cover"/>
              : <span style={{ fontSize: 80 }}>{food.emoji || '🥗'}</span>
            }
          </div>

          {/* Nutrition — grid 2x2 on mobile, list on md+ */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-3">
              ข้อมูลโภชนาการ (ต่อ 100g)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
              {[['🔥 แคลอรี', food.calories,'kcal'],['💪 โปรตีน',food.protein,'g'],['🌾 คาร์โบไฮเดรต',food.carbs,'g'],['🥑 ไขมัน',food.fat,'g']].map(([l,v,u]) => (
                <div key={l}
                  className="md:flex md:justify-between md:py-2.5 md:border-b md:border-gray-50 md:last:border-0
                             flex flex-col items-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-none p-3 md:p-0">
                  <span className="text-xs sm:text-sm text-gray-500 text-center md:text-left">{l}</span>
                  <span className="text-sm font-bold text-gray-800 mt-0.5 md:mt-0">{Number(v).toFixed(1)} {u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: detail */}
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
                  <span key={i} className="bg-primary-xlight text-primary font-medium px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
