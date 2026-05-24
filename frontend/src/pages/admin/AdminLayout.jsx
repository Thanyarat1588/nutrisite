// src/pages/admin/AdminLayout.jsx — Mobile First with bottom nav on mobile
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin',            icon: '📊', label: 'Dashboard',       end: true  },
  { to: '/admin/foods',      icon: '🥗', label: 'จัดการอาหาร'              },
  { to: '/admin/categories', icon: '📂', label: 'จัดการหมวดหมู่'           },
  { to: '/admin/settings',   icon: '⚙️', label: 'ตั้งค่าหน้าเว็บ'          },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('ออกจากระบบแล้ว');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-56 bg-gray-900 text-white flex-col sticky top-0 h-screen shrink-0">
        <div className="px-5 py-5 border-b border-gray-800">
          <p className="font-display text-lg text-green-400 font-bold">🌿 NutriAdmin</p>
          {admin && <p className="text-xs text-gray-400 mt-1 truncate">{admin.display_name}</p>}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-green-900/50 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
              <span>{item.icon}</span><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <span>🌐</span><span>ดูหน้าเว็บ</span>
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-all">
            <span>🚪</span><span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50"/>
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col"
                 onClick={e => e.stopPropagation()}>
            <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-green-400 font-bold">🌿 NutriAdmin</p>
                {admin && <p className="text-xs text-gray-400 mt-0.5 truncate">{admin.display_name}</p>}
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-green-900/50 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}>
                  <span className="text-lg">{item.icon}</span><span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-gray-800 space-y-1">
              <button onClick={() => { navigate('/'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white">
                <span>🌐</span><span>ดูหน้าเว็บ</span>
              </button>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/30">
                <span>🚪</span><span>ออกจากระบบ</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="md:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}
            className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100">
            <span className="block w-5 h-0.5 bg-gray-700"/>
            <span className="block w-5 h-0.5 bg-gray-700"/>
            <span className="block w-5 h-0.5 bg-gray-700"/>
          </button>
          <p className="font-display text-base text-primary font-bold">🌿 NutriAdmin</p>
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-primary text-sm font-medium">
            🌐
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto pb-20 md:pb-8">
          <Outlet/>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-center transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium leading-tight px-1 truncate w-full text-center">
                {item.label.replace('จัดการ', '').replace('ตั้งค่า', 'ตั้งค่า').trim()}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
