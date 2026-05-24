// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          🌿 NutriSite
        </Link>
        <div className="flex items-center gap-1">
          {[['/', 'หน้าแรก'], ['/foods', 'อาหารสุขภาพ'], ['/categories', 'หมวดหมู่']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary bg-primary-xlight' : 'text-gray-500 hover:text-primary hover:bg-primary-xlight'}`}>
              {label}
            </NavLink>
          ))}
          {isAdmin
            ? <>
                <NavLink to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-primary">
                  Admin
                </NavLink>
                <button onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-full text-sm font-semibold border-2 border-primary text-primary hover:bg-primary-xlight transition-colors">
                  ออกจากระบบ
                </button>
              </>
            : <Link to="/admin/login"
                className="ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
                แอดมิน
              </Link>
          }
        </div>
      </div>
    </nav>
  );
}

// src/components/Footer.jsx
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-green-400 text-xl font-bold mb-3">🌿 NutriSite</p>
          <p className="text-sm leading-relaxed">แหล่งความรู้เรื่องอาหารเพื่อสุขภาพ คัดสรรข้อมูลที่ถูกต้องและเป็นประโยชน์</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">เมนูหลัก</p>
          {[['/', 'หน้าแรก'], ['/foods', 'อาหารสุขภาพ'], ['/categories', 'หมวดหมู่']].map(([to, l]) => (
            <Link key={to} to={to} className="block text-sm py-1 hover:text-green-400 transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <p className="text-white font-semibold mb-3">ติดต่อ</p>
          <p className="text-sm leading-loose">📧 info@nutrisite.th<br/>📱 @NutriSiteTH<br/>🌐 www.nutrisite.th</p>
        </div>
      </div>
      <p className="text-center text-sm mt-8 pt-6 border-t border-gray-800">© 2025 NutriSite. สงวนลิขสิทธิ์.</p>
    </footer>
  );
}

// src/components/FoodCard.jsx
export function FoodCard({ food, category, onClick }) {
  return (
    <div onClick={() => onClick?.(food)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer
                 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-44 flex items-center justify-center relative"
           style={{ background: food.bg_color || '#f0fdf4' }}>
        {food.image_url
          ? <img src={food.image_url} alt={food.title} className="w-full h-full object-cover"/>
          : <span style={{ fontSize: 60 }}>{food.emoji || '🥗'}</span>
        }
        {food.is_featured === 1 &&
          <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">⭐ แนะนำ</span>
        }
      </div>
      <div className="p-4">
        {category && (
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2"
                style={{ background: category.bg_color, color: category.color }}>
            {category.icon} {category.name}
          </span>
        )}
        <h3 className="font-bold text-gray-900 text-base">{food.title}</h3>
        <p className="text-gray-500 text-sm mb-3">{food.subtitle}</p>
        <div className="grid grid-cols-4 gap-1">
          {[['แคล', food.calories, 'kcal'], ['โปรตีน', food.protein, 'g'], ['คาร์บ', food.carbs, 'g'], ['ไขมัน', food.fat, 'g']].map(([l, v, u]) => (
            <div key={l} className="text-center bg-gray-50 rounded-lg py-1.5">
              <div className="font-bold text-sm text-gray-800">{Number(v).toFixed(0)}{u}</div>
              <div className="text-gray-400 text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// src/components/LoadingSpinner.jsx
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-primary-xlight border-t-primary rounded-full animate-spin"/>
    </div>
  );
}

// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
export function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Spinner/>;
  return isAdmin ? children : <Navigate to="/admin/login" replace/>;
}
