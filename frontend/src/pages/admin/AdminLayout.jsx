// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin',             icon: '📊', label: 'Dashboard',        end: true },
  { to: '/admin/foods',       icon: '🥗', label: 'จัดการอาหาร' },
  { to: '/admin/categories',  icon: '📂', label: 'จัดการหมวดหมู่' },
  { to: '/admin/settings',    icon: '⚙️', label: 'ตั้งค่าหน้าเว็บ' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('ออกจากระบบแล้ว');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col sticky top-0 h-screen shrink-0">
        <div className="px-5 py-6 border-b border-gray-800">
          <p className="font-display text-lg text-green-400 font-bold">🌿 NutriAdmin</p>
          {admin && <p className="text-xs text-gray-400 mt-1 truncate">{admin.display_name}</p>}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-green-900/50 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-2">
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <span>🌐</span><span>ดูหน้าเว็บ</span>
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-all">
            <span>🚪</span><span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet/>
      </main>
    </div>
  );
}
