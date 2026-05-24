// src/pages/public/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoods, getCategories } from '../../utils/api';
import axios from 'axios';
import { FoodCard, Spinner } from '../../components/index';

export default function HomePage() {
  const [foods, setFoods]       = useState([]);
  const [cats,  setCats]        = useState([]);
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

  const catMap = Object.fromEntries(cats.map(c => [c.id, c]));
  const heroImage    = settings.hero_image    || null;
  const heroTitle    = settings.hero_title    || 'กินดี ชีวิตยืนยาว';
  const heroSubtitle = settings.hero_subtitle || 'รวบรวมความรู้เรื่องอาหารเพื่อสุขภาพที่ครบถ้วน ช่วยให้คุณเลือกกินอาหารที่มีประโยชน์ต่อร่างกายและจิตใจ';

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-primary-xlight text-primary text-sm font-semibold px-4 py-2 rounded-full mb-5">
              🌿 แหล่งความรู้อาหารเพื่อสุขภาพ
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-5">
              {heroTitle.split(' ').map((w, i) => (
                <span key={i}>{i % 2 === 1 ? <span className="text-primary">{w}</span> : w}{' '}</span>
              ))}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">{heroSubtitle}</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate('/foods')}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                ดูอาหารทั้งหมด →
              </button>
              <button onClick={() => navigate('/categories')}
                className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary-xlight transition-all">
                หมวดหมู่อาหาร
              </button>
            </div>
            <div className="flex gap-8 mt-10">
              {[[foods.length + '+', 'รายการอาหาร'], [cats.length, 'หมวดหมู่'], ['100%', 'ข้อมูลถูกต้อง']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-bold text-primary">{v}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative bg-gradient-to-br from-green-100 to-green-50 rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
              {heroImage
                ? <img src={heroImage} alt="Hero" className="w-full h-full object-cover"/>
                : <span className="text-8xl">🥗</span>
              }
              <div className="absolute bottom-6 right-6 bg-white rounded-2xl px-4 py-3 shadow-lg">
                <div className="text-xs text-gray-400">แคลอรีเฉลี่ย</div>
                <div className="font-display text-xl font-bold text-primary">~350 kcal</div>
              </div>
              <div className="absolute top-6 left-6 bg-white rounded-2xl px-3 py-2 shadow-lg text-sm font-semibold text-green-700">
                ✓ ดีต่อสุขภาพ
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* ── Categories ── */}
        <section className="py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900">หมวดหมู่อาหาร</h2>
              <p className="text-gray-400 mt-1">เลือกดูอาหารตามประเภทที่สนใจ</p>
            </div>
            <button onClick={() => navigate('/categories')}
              className="text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary-xlight transition-colors">
              ดูทั้งหมด
            </button>
          </div>
          {loading ? <Spinner/> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {cats.map(c => (
                <div key={c.id} onClick={() => navigate(`/foods?category=${c.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                       style={{ background: c.bg_color }}>
                    {c.icon}
                  </div>
                  <div className="font-semibold text-sm text-gray-800 mb-0.5">{c.name}</div>
                  <div className="text-xs font-semibold" style={{ color: c.color }}>{c.food_count} รายการ</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Featured Foods ── */}
        <section className="py-8 pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900">⭐ อาหารแนะนำ</h2>
              <p className="text-gray-400 mt-1">คัดสรรมาเพื่อสุขภาพที่ดีของคุณ</p>
            </div>
            <button onClick={() => navigate('/foods')}
              className="text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary-xlight transition-colors">
              ดูทั้งหมด
            </button>
          </div>
          {loading ? <Spinner/> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {foods.map(f => (
                <FoodCard key={f.id} food={f} category={catMap[f.category_id]}
                  onClick={() => navigate(`/foods/${f.id}`)}/>
              ))}
            </div>
          )}
        </section>

        {/* ── Info Banner ── */}
        <section className="mb-16 bg-gradient-to-br from-green-50 to-white rounded-3xl p-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-7xl text-center">🌿</div>
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">ทำไมต้องกินอาหารสุขภาพ?</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              อาหารเพื่อสุขภาพไม่ได้แปลว่าต้องน่าเบื่อ การเลือกกินอาหารที่มีคุณค่าทางโภชนาการ
              ช่วยให้ร่างกายแข็งแรง ลดความเสี่ยงโรคเรื้อรัง และทำให้รู้สึกดีขึ้นทั้งร่างกายและจิตใจ
            </p>
            <button onClick={() => navigate('/foods')}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors">
              เริ่มต้นเรียนรู้
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
