// src/App.jsx — ระบบ Routing หลักทั้งหมด
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar, Footer, ProtectedRoute } from './components/index';

// Public Pages
import HomePage       from './pages/public/HomePage';
import FoodsPage      from './pages/public/FoodsPage';
import FoodDetailPage from './pages/public/FoodDetailPage';
import CategoriesPage from './pages/public/CategoriesPage';

// Admin Pages
import AdminLoginPage      from './pages/admin/AdminLoginPage';
import AdminLayout         from './pages/admin/AdminLayout';
import DashboardPage       from './pages/admin/DashboardPage';
import AdminFoodsPage      from './pages/admin/AdminFoodsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminSettingsPage   from './pages/admin/AdminSettingsPage';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 2500 }}/>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage/></PublicLayout>}/>
          <Route path="/foods" element={<PublicLayout><FoodsPage/></PublicLayout>}/>
          <Route path="/foods/:id" element={<PublicLayout><FoodDetailPage/></PublicLayout>}/>
          <Route path="/categories" element={<PublicLayout><CategoriesPage/></PublicLayout>}/>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage/>}/>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
            <Route index element={<DashboardPage/>}/>
            <Route path="foods"      element={<AdminFoodsPage/>}/>
            <Route path="categories" element={<AdminCategoriesPage/>}/>
            <Route path="settings"   element={<AdminSettingsPage/>}/>
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-xl font-bold text-gray-600 mb-2">ไม่พบหน้าที่ต้องการ</h2>
                <a href="/" className="text-primary font-semibold hover:underline mt-3">← กลับหน้าแรก</a>
              </div>
            </PublicLayout>
          }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
