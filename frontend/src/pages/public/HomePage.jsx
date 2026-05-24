// src/pages/public/HomePage.jsx — Mobile First
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoods, getCategories } from '../../utils/api';
import axios from 'axios';
import { FoodCard, Spinner } from '../../components/index';

export default function HomePage() {
  const [foods,    setFoods]    = useState([]);
  const [cats,     setCats]     = useState([]);
  const [settings, setSettings] = useState({});
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getFoods({ featured: 'true', limit: 8 }),
      getCategories(),
      axios.get('/api/settings'),
    ]).then(([fRes, cRes, sRes]) => {
      setFoods(fRes.data.data);
      setCats(cRes.data.data);
      setSettings(sRes.data.data || {});
    }).finally(() => setLoading(false));
  }, []);

  const catMap       = Object.fromEntries(cats.map(c => [c.id, c]));
  const heroImage    = settings.hero_image    || null;
  const heroTitle    = settings.hero_title    || 'กินดี ชีวิตยืนยาว';
  const heroSubtitle = settings.hero_subtitle || 'รวบรวมความรู้เรื่องอาหารเพื่อสุขภาพที่ครบถ้วน ช่วยให้คุณเลือกกินอาหารที่มีประโยชน์ต่อร่างกายและจิตใจ';

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text */}
            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 bg-primary-xlight text-primary text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4">
                🌿 แหล่งความรู้อาหารเพื่อสุขภาพ
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-4">
                {heroTitle}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">{heroSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/foods')}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-md text-sm sm:text-base text-center">
                  ดูอาหารทั้งหมด →
                </button>
                <button onClick={() => navigate('/categories')}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary-xlight transition-all text-sm sm:text-base text-center">
                  หมวดหมู่อาหาร
                </button>
              </div>
              <div className="flex gap-6 sm:gap-10 mt-8">
                {[[foods.length + '+', 'รายการอาหาร'], [cats.length, 'หมวดหมู่'], ['100%', 'ข้อมูลถูกต้อง']].map(([v, l]) => (
                  <div key={l}>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-primary">{v}</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Image */}
            <div className="order-1 md:order-2">
              <div className="relative bg-gradient-to-br from-green-100 to-green-50 rounded-3xl aspect-square flex items-center justify-center overflow-hidden max-w-xs sm:max-w-sm md:max-w-full mx-auto">
                {heroImage
                  ? <img src={heroImage} alt="Hero" className="w-full h-full object-cover"/>
                  : <span className="text-7xl sm:text-8xl">🥗</span>
                }
                <div className="absolute bottom-4 right-4 bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
                  <div className="text-xs text-gray-400">แคลอรีเฉลี่ย</div>
                  <div className="font-display text-base sm:text-xl font-bold text-primary">~350 kcal</div>
                </div>
                <div className="absolute top-4 left-4 bg-white rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-lg text-xs sm:text-sm font-semibold text-green-700">
                  ✓ ดีต่อสุขภาพ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Categories ── */}
        <section className="py-10 sm:py-14">
          <div className="flex items-end justify-between mb-5 sm:mb-7">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">หมวดหมู่อาหาร</h2>
              <p className="text-gray-400 text-sm mt-1 hidden sm:block">เลือกดูอาหารตามประเภทที่สนใจ</p>
            </div>
            <button onClick={() => navigate('/categories')}
              className="text-xs sm:text-sm font-semibold text-primary border border-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-primary-xlight transition-colors whitespace-nowrap">
              ดูทั้งหมด
            </button>
          </div>
          {loading ? <Spinner/> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {cats.map(c => (
                <div key={c.id} onClick={() => navigate(`/foods?category=${c.id}`)}
                  className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all active:scale-95 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2"
                       style={{ background: c.bg_color }}>
                    {c.icon}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-gray-800 leading-tight">{c.name}</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: c.color }}>{c.food_count} รายการ</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Featured Foods ── */}
        <section className="pb-12 sm:pb-16">
          <div className="flex items-end justify-between mb-5 sm:mb-7">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">⭐ อาหารแนะนำ</h2>
              <p className="text-gray-400 text-sm mt-1 hidden sm:block">คัดสรรมาเพื่อสุขภาพที่ดีของคุณ</p>
            </div>
            <button onClick={() => navigate('/foods')}
              className="text-xs sm:text-sm font-semibold text-primary border border-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-primary-xlight transition-colors whitespace-nowrap">
              ดูทั้งหมด
            </button>
          </div>
          {loading ? <Spinner/> : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {foods.map(f => (
                <FoodCard key={f.id} food={f} category={catMap[f.category_id]}
                  onClick={() => navigate(`/foods/${f.id}`)}/>
              ))}
            </div>
          )}
        </section>

        {/* ── Info Banner ── */}
        <section className="mb-12 sm:mb-16 bg-gradient-to-br from-green-50 to-white rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-5xl sm:text-7xl text-center md:text-left">🌿</div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">ทำไมต้องกินอาหารสุขภาพ?</h2>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base mb-5 sm:mb-6">
                อาหารเพื่อสุขภาพไม่ได้แปลว่าต้องน่าเบื่อ การเลือกกินอาหารที่มีคุณค่าทางโภชนาการ
                ช่วยให้ร่างกายแข็งแรง ลดความเสี่ยงโรคเรื้อรัง และทำให้รู้สึกดีขึ้น
              </p>
              <button onClick={() => navigate('/foods')}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors text-sm sm:text-base text-center block">
                เริ่มต้นเรียนรู้
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
