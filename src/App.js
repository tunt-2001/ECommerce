import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import themes from './themes'; // Import hàm tạo theme
import config from './config'; 
import PrivateRoute from './routes/PrivateRoute';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/admin/dashboard/index';
import CategoryListPage from './pages/admin/category/CategoryListPage';
import ProductListPage from './pages/admin/product/ProductListPage';
import UserListPage from './pages/admin/user/UserListPage';
import AdminOrderListPage from './pages/admin/order/AdminOrderListPage';
import MarketingPageLayout from './pages/admin/marketing/MarketingPageLayout';
import NewsletterComposePage from './pages/admin/marketing/NewsletterComposePage';
import NewsletterHistoryPage from './pages/admin/marketing/NewsletterHistoryPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const customization = config;

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                
                <Router>
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute roles={['Admin']}>
                                    <AdminLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<Navigate to="/admin/dashboard" replace />} /> 
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="categories" element={<CategoryListPage />} />
                            <Route path="products" element={<ProductListPage />} />
                            <Route path="users" element={<UserListPage />} />
                            <Route path="orders" element={<AdminOrderListPage />} /> 
                            <Route path="marketing" element={<MarketingPageLayout />}>
                                <Route index element={<Navigate to="/admin/marketing/compose" replace />} /> 
                                <Route path="compose" element={<NewsletterComposePage />} />
                                <Route path="history" element={<NewsletterHistoryPage />} />
                            </Route>
                        </Route>

                        <Route element={<MainLayout />}>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/my-orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
                            <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
                            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                        </Route>

                    </Routes>
                </Router>

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
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;