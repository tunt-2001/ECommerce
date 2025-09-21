import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DashboardPage from './pages/admin/dashboard/DashboardPage';
import CategoryListPage from './pages/admin/category/CategoryListPage';
import ProductListPage from './pages/admin/product/ProductListPage';
import UserListPage from './pages/admin/user/UserListPage';
// Layouts & Routes
import PrivateRoute from './routes/PrivateRoute';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {/* --- LUỒNG PUBLIC VÀ USER --- */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        {/* Thêm các trang khác cho user ở đây, ví dụ: */}
                        {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
                        {/* <Route path="/my-orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} /> */}
                    </Route>

                    {/* --- LUỒNG ADMIN --- */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={['Admin']}>
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="categories" element={<CategoryListPage />} />
                        <Route path="products" element={<ProductListPage />} />
                        <Route path="users" element={<UserListPage />} />
                    </Route>

                    {/* Route bắt các URL không tồn tại */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </>
    );
}

export default App;