import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages - Public & User
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Pages - Admin
import DashboardPage from './pages/admin/dashboard/DashboardPage';
import CategoryListPage from './pages/admin/category/CategoryListPage';
import ProductListPage from './pages/admin/product/ProductListPage';
import UserListPage from './pages/admin/user/UserListPage';

// Layouts & Route Protection
import PrivateRoute from './routes/PrivateRoute';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; // 1. Import CartPage
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutPage from './pages/CheckoutPage'; // Import trang mới
import AdminOrderListPage from './pages/admin/order/AdminOrderListPage';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {/* ========================================================== */}
                    {/* LUỒNG ADMIN - Được bảo vệ và có layout riêng             */}
                    {/* Tất cả các URL bắt đầu bằng /admin sẽ đi vào đây          */}
                    {/* ========================================================== */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={['Admin']}>
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        {/* Khi vào /admin, tự động chuyển đến dashboard */}
                        <Route index element={<Navigate to="/admin/dashboard" replace />} /> 
                        
                        {/* Các trang con của Admin */}
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="categories" element={<CategoryListPage />} />
                        <Route path="products" element={<ProductListPage />} />
                        <Route path="users" element={<UserListPage />} />
                        <Route path="orders" element={<AdminOrderListPage />} /> 
                    </Route>

                    {/* ========================================================== */}
                    {/* LUỒNG PUBLIC & USER - Sử dụng layout chính                */}
                    {/* Tất cả các URL không khớp với /admin sẽ đi vào đây       */}
                    {/* ========================================================== */}
                    <Route element={<MainLayout />}>
                        {/* Trang gốc "/", sử dụng LandingPage để phân luồng */}
                        <Route path="/" element={<LandingPage />} />
                        
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Thêm các trang khác cho người dùng ở đây */}
                        {/* Ví dụ: <Route path="/products/:id" element={<ProductDetailPage />} /> */}
                        {/* Ví dụ: <Route path="/cart" element={<CartPage />} /> */}
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/my-orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
                        <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
                        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                    </Route>

                </Routes>
            </Router>

            {/* Component để hiển thị thông báo pop-up */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default App;