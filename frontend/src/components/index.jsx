import { useState } from 'react';
import { Link, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Breakpoints (Tailwind default, min-width)
   sm  = 640px   (large phone / small tablet)
   md  = 768px   (tablet portrait)
   lg  = 1024px  (tablet landscape / laptop)
   xl  = 1280px  (desktop)
──────────────────────────────────────────────── */

export function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };
  const links = [['/', 'หน้าแรก'], ['/foods', 'อาหารสุขภาพ'], ['/categories', 'หมวดหมู่']];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 lg:h-16">
        <Link to="/" onClick={() => setOpen(false)}
          className="font-display text-xl lg:text-2xl font-bold text-primary flex items-center gap-1.5">
          🌿 NutriSite
        </Link>

        {/* Desktop nav — lg ขึ้นไป */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors
                 ${isActive ? 'text-primary bg-primary-xlight' : 'text-gray-500 hover:text-primary hover:bg-primary-xlight'}`}>
              {label}
            </NavLink>
          ))}
          {isAdmin ? (
            <>
              <NavLink to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-primary">Admin</NavLink>
              <button onClick={handleLogout}
                className="ml-1 px-4 py-2 rounded-full text-sm font-semibold border-2 border-primary text-primary hover:bg-primary-xlight transition-colors">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link to="/admin/login"
              className="ml-1 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
              แอดมิน
            </Link>
          )}
        </div>

        {/* Hamburger — ต่ำกว่า lg */}
        <button onClick={() => setOpen(o => !o)}
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100">
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? 'opacity-0' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>

      {/* Mobile/Tablet Drawer */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 shadow-lg">
          {/* Tablet: แสดงเมนูแนวนอน / Mobile: แนวตั้ง */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 md:py-2 rounded-xl text-sm font-medium transition-colors
                   ${isActive ? 'text-primary bg-primary-xlight' : 'text-gray-600 hover:bg-gray-50'}`}>
                {label}
              </NavLink>
            ))}
            <div className="pt-2 md:pt-0 md:ml-auto border-t md:border-0 border-gray-100 mt-1 md:mt-0">
              {isAdmin ? (
                <div className="flex flex-col md:flex-row gap-2">
                  <NavLink to="/admin" onClick={() => setOpen(false)}
                    className="px-4 py-2.5 md:py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 text-center">
                    ⚙️ Admin
                  </NavLink>
                  <button onClick={handleLogout}
                    className="px-4 py-2.5 md:py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-center">
                    🚪 ออกจากระบบ
                  </button>
                </div>
              ) : (
                <Link to="/admin/login" onClick={() => setOpen(false)}
                  className="flex items-center justify-center py-2.5 md:py-2 px-5 bg-primary text-white font-semibold rounded-xl text-sm">
                  🔐 เข้าสู่ระบบแอดมิน
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-green-400 text-xl font-bold mb-3">🌿 NutriSite</p>
          <p className="text-sm leading-relaxed">แหล่งความรู้เรื่องอาหารเพื่อสุขภาพ คัดสรรข้อมูลที่ถูกต้องและเป็นประโยชน์</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">เมนูหลัก</p>
          {[['/', 'หน้าแรก'], ['/foods', 'อาหารสุขภาพ'], ['/categories', 'หมวดหมู่']].map(([to, l]) => (
            <Link key={to} to={to} className="block text-sm py-1.5 hover:text-green-400 transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <p className="text-white font-semibold mb-3">ติดต่อ</p>
          <div className="space-y-1.5 text-sm">
            <p>📧 info@nutrisite.th</p>
            <p>📱 @NutriSiteTH</p>
            <p>🌐 www.nutrisite.th</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2025 NutriSite. สงวนลิขสิทธิ์.
      </div>
    </footer>
  );
}

export function FoodCard({ food, category, onClick }) {
  return (
    <div onClick={() => onClick?.(food)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer
                 transition-all duration-200 active:scale-95 hover:-translate-y-1 hover:shadow-lg">
      {/* รูป: สูง 36 (mobile) → 40 (sm) → 44 (md) → 48 (lg) */}
      <div className="h-36 sm:h-40 md:h-44 lg:h-48 flex items-center justify-center relative"
           style={{ background: food.bg_color || '#f0fdf4' }}>
        {food.image_url
          ? <img src={food.image_url} alt={food.title} className="w-full h-full object-cover"/>
          : <span style={{ fontSize: 52 }}>{food.emoji || '🥗'}</span>
        }
        {food.is_featured === 1 && (
          <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ⭐ แนะนำ
          </span>
        )}
      </div>
      <div className="p-3 md:p-4">
        {category && (
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5"
                style={{ background: category.bg_color, color: category.color }}>
            {category.icon} {category.name}
          </span>
        )}
        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight line-clamp-1">{food.title}</h3>
        <p className="text-gray-400 text-xs md:text-sm mt-0.5 mb-3 line-clamp-1">{food.subtitle}</p>
        <div className="grid grid-cols-4 gap-1">
          {[['แคล', food.calories, 'k'], ['โปรตีน', food.protein, 'g'], ['คาร์บ', food.carbs, 'g'], ['ไขมัน', food.fat, 'g']].map(([l, v, u]) => (
            <div key={l} className="text-center bg-gray-50 rounded-lg py-1.5">
              <div className="font-bold text-xs md:text-sm text-gray-800">{Number(v).toFixed(0)}{u}</div>
              <div className="text-gray-400 text-[10px] md:text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-primary-xlight border-t-primary rounded-full animate-spin"/>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Spinner/>;
  return isAdmin ? children : <Navigate to="/admin/login" replace/>;
}
