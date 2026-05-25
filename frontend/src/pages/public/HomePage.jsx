import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoods, getCategories } from '../../utils/api';
import axios from 'axios';
import { FoodCard, Spinner } from '../../components/index';

/*  Responsive Grid Strategy (min-width)
    mobile  <640px  : cols-1 / cols-2
    sm      640px   : cols-2 / cols-3
    md      768px   : cols-2 / cols-4   ← แท็บเลต portrait
    lg      1024px  : cols-3 / cols-4   ← แท็บเลต landscape
    xl      1280px  : cols-4 / cols-6
*/

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
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6
                        py-10 sm:py-14 md:py-16 lg:py-20">

          {/* mobile: stack / md+: side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2
                          gap-8 md:gap-10 lg:gap-14 items-center">

            {/* Text — อยู่ล่างบน mobile, ซ้ายบน md+ */}
            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 bg-primary-xlight text-primary
                               text-xs sm:text-sm font-semibold
                               px-3 sm:px-4 py-1.5 rounded-full mb-4">
                🌿 แหล่งความรู้อาหารเพื่อสุขภาพ
              </span>

              <h1 className="font-display leading-tight text-gray-900 mb-4
                             text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                {heroTitle}
              </h1>

              <p className="text-gray-500 leading-relaxed mb-6
                            text-sm sm:text-base md:text-sm lg:text-base max-w-md">
                {heroSubtitle}
              </p>

              {/* ปุ่ม: เต็มกว้าง mobile → auto md+ */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
                <button onClick={() => navigate('/foods')}
                  className="w-full sm:w-auto md:w-full lg:w-auto
                             px-6 py-3 bg-primary text-white font-semibold rounded-full
                             hover:bg-primary-dark transition-all shadow-md text-sm sm:text-base text-center">
                  ดูอาหารทั้งหมด →
                </button>
                <button onClick={() => navigate('/categories')}
                  className="w-full sm:w-auto md:w-full lg:w-auto
                             px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full
                             hover:bg-primary-xlight transition-all text-sm sm:text-base text-center">
                  หมวดหมู่อาหาร
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-10 mt-8">
                {[[foods.length + '+', 'รายการอาหาร'], [cats.length, 'หมวดหมู่'], ['100%', 'ข้อมูลถูกต้อง']].map(([v, l]) => (
                  <div key={l}>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-primary">{v}</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image — อยู่บนบน mobile, ขวาบน md+ */}
            <div className="order-1 md:order-2">
              <div className="relative bg-gradient-to-br from-green-100 to-green-50
                              rounded-3xl aspect-square overflow-hidden flex items-center justify-center
                              max-w-[260px] sm:max-w-sm md:max-w-full mx-auto">
                {heroImage
                  ? <img src={heroImage} alt="Hero" className="w-full h-full object-cover"/>
                  : <span className="text-7xl sm:text-8xl">🥗</span>
                }
                <div className="absolute bottom-4 right-4 bg-white rounded-xl px-3 py-2 shadow-lg">
                  <div className="text-xs text-gray-400">แคลอรีเฉลี่ย</div>
                  <div className="font-display text-base sm:text-lg font-bold text-primary">~350 kcal</div>
                </div>
                <div className="absolute top-4 left-4 bg-white rounded-xl px-2.5 py-1.5 shadow-lg text-xs sm:text-sm font-semibold text-green-700">
                  ✓ ดีต่อสุขภาพ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ══ CATEGORIES ════════════════════════════════════════ */}
        <section className="py-10 sm:py-12 md:py-14">
          <div className="flex items-end justify-between mb-5 sm:mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">หมวดหมู่อาหาร</h2>
              <p className="text-gray-400 text-sm mt-1">เลือกดูอาหารตามประเภทที่สนใจ</p>
            </div>
            <button onClick={() => navigate('/categories')}
              className="text-xs sm:text-sm font-semibold text-primary border border-primary
                         px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-primary-xlight whitespace-nowrap">
              ดูทั้งหมด
            </button>
          </div>

          {loading ? <Spinner/> : (
            /* mobile:2  sm:3  md:4  lg:6 */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {cats.map(c => (
                <div key={c.id} onClick={() => navigate(`/foods?category=${c.id}`)}
                  className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer
                             hover:-translate-y-1 hover:shadow-md transition-all active:scale-95 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                                  text-xl sm:text-2xl mx-auto mb-2"
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

        {/* ══ FEATURED FOODS ════════════════════════════════════ */}
        <section className="pb-12 sm:pb-16">
          <div className="flex items-end justify-between mb-5 sm:mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">⭐ อาหารแนะนำ</h2>
              <p className="text-gray-400 text-sm mt-1">คัดสรรมาเพื่อสุขภาพที่ดีของคุณ</p>
            </div>
            <button onClick={() => navigate('/foods')}
              className="text-xs sm:text-sm font-semibold text-primary border border-primary
                         px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-primary-xlight whitespace-nowrap">
              ดูทั้งหมด
            </button>
          </div>

          {loading ? <Spinner/> : (
            /* mobile:2  md:3  lg:4 */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {foods.map(f => (
                <FoodCard key={f.id} food={f} category={catMap[f.category_id]}
                  onClick={() => navigate(`/foods/${f.id}`)}/>
              ))}
            </div>
          )}
        </section>

        {/* ══ INFO BANNER ═══════════════════════════════════════ */}
        <section className="mb-12 sm:mb-16 bg-gradient-to-br from-green-50 to-white rounded-3xl
                            p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="text-5xl sm:text-6xl md:text-7xl text-center">🌿</div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                ทำไมต้องกินอาหารสุขภาพ?
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base mb-5">
                อาหารเพื่อสุขภาพไม่ได้แปลว่าต้องน่าเบื่อ การเลือกกินอาหารที่มีคุณค่าทางโภชนาการ
                ช่วยให้ร่างกายแข็งแรง ลดความเสี่ยงโรคเรื้อรัง และทำให้รู้สึกดีขึ้น
              </p>
              <button onClick={() => navigate('/foods')}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-full
                           hover:bg-primary-dark transition-colors text-sm sm:text-base">
                เริ่มต้นเรียนรู้
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
