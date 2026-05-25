import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to:'/admin',            icon:'📊', label:'Dashboard',       end:true },
  { to:'/admin/foods',      icon:'🥗', label:'จัดการอาหาร'            },
  { to:'/admin/categories', icon:'📂', label:'จัดการหมวดหมู่'          },
  { to:'/admin/settings',   icon:'⚙️', label:'ตั้งค่าหน้าเว็บ'         },
];

/* Breakpoints
   < md  (768px)  : mobile  → top bar + bottom tab bar
   md–lg (768–1024px): tablet → top bar + slide-in drawer
   > lg  (1024px) : desktop → fixed sidebar
*/
export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('ออกจากระบบแล้ว'); navigate('/'); };

  const SidebarContent = ({ onClose }) => (
    <>
      <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between">
        <div>
          <p className="font-display text-lg text-green-400 font-bold">🌿 NutriAdmin</p>
          {admin && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{admin.display_name}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center lg:hidden">
            ✕
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
               ${isActive ? 'bg-green-900/50 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <button onClick={() => { navigate('/'); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white">
          <span>🌐</span><span>ดูหน้าเว็บ</span>
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30">
          <span>🚪</span><span>ออกจากระบบ</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Desktop Sidebar (lg+) ── */}
      <aside className="hidden lg:flex w-60 bg-gray-900 text-white flex-col sticky top-0 h-screen shrink-0">
        <SidebarContent/>
      </aside>

      {/* ── Tablet/Mobile Drawer Overlay (< lg) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)}/>
          {/* drawer — กว้าง 256px tablet / 80% mobile */}
          <aside className="absolute left-0 top-0 h-full
                            w-4/5 max-w-xs sm:w-64 md:w-72
                            bg-gray-900 text-white flex flex-col
                            shadow-2xl">
            <SidebarContent onClose={() => setDrawerOpen(false)}/>
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar (< lg) */}
        <header className="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-30
                           px-4 h-14 md:h-16 flex items-center justify-between">
          <button onClick={() => setDrawerOpen(true)}
            className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100">
            <span className="block w-5 h-0.5 bg-gray-700"/>
            <span className="block w-5 h-0.5 bg-gray-700"/>
            <span className="block w-5 h-0.5 bg-gray-700"/>
          </button>
          <p className="font-display text-base md:text-lg text-primary font-bold">🌿 NutriAdmin</p>
          <button onClick={() => navigate('/')}
            className="text-gray-400 hover:text-primary p-2 rounded-lg hover:bg-gray-100">
            🌐
          </button>
        </header>

        {/* Page Content */}
        {/* padding-bottom เผื่อ bottom nav บน mobile */}
        <main className="flex-1 overflow-auto
                         p-4 sm:p-5 md:p-6 lg:p-8
                         pb-24 md:pb-28 lg:pb-8">
          <Outlet/>
        </main>
      </div>

      {/* ── Bottom Tab Bar (< md only) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30"
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-4 h-16">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 transition-colors
                 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[9px] font-medium leading-tight px-0.5 text-center truncate w-full">
                {item.label.length > 6 ? item.label.slice(0, 5) + '…' : item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Tablet Bottom Bar (md only, bigger) ── */}
      <nav className="hidden md:flex lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
        <div className="grid grid-cols-4 w-full h-16">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition-colors
                 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
              <span className="text-2xl leading-none">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
