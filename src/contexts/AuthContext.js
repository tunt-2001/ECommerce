import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

// Tạo Context để các component khác có thể sử dụng
export const AuthContext = createContext(null);

// Định nghĩa hằng số cho claim type của Role để tránh "magic strings"
const ROLE_CLAIM_TYPE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAME_CLAIM_TYPE = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

export const AuthProvider = ({ children }) => {
    // State để lưu thông tin người dùng (null nếu chưa đăng nhập)
    const [user, setUser] = useState(null);
    // State để xử lý trạng thái loading ban đầu khi kiểm tra token
    const [loading, setLoading] = useState(true);

    /**
     * Hàm helper để thiết lập thông tin người dùng từ token
     */
    const setUserFromToken = (token) => {
        const decodedToken = jwtDecode(token);
        setUser({
            // Claim 'name' trong token của chúng ta chứa UserName/Email
            username: decodedToken[NAME_CLAIM_TYPE], 
            // Claim 'role' chứa quyền của người dùng
            role: decodedToken[ROLE_CLAIM_TYPE]
        });
    };

    // useEffect này chỉ chạy một lần khi ứng dụng được tải lần đầu tiên
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = localStorage.getItem('authToken');
                // Nếu có token trong localStorage, kiểm tra xem nó còn hợp lệ không
                if (token) {
                    const decodedToken = jwtDecode(token);
                    // So sánh thời gian hết hạn (tính bằng mili giây) với thời gian hiện tại
                    if (decodedToken.exp * 1000 > Date.now()) {
                        setUserFromToken(token); // Nếu hợp lệ, thiết lập lại thông tin user
                    } else {
                        // Nếu hết hạn, xóa token khỏi localStorage
                        localStorage.removeItem('authToken');
                    }
                }
            } catch (error) {
                console.error("Failed to initialize auth from token", error);
                // Nếu token bị lỗi, xóa nó đi
                localStorage.removeItem('authToken');
            } finally {
                // Dù thành công hay thất bại, cũng kết thúc trạng thái loading
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Hàm xử lý đăng nhập
     * @param {string} username - Tên đăng nhập
     * @param {string} password - Mật khẩu
     * @returns {Promise<string>} - Trả về chuỗi JWT token
     */
    const login = useCallback(async (username, password) => {
        const response = await api.post('/accounts/login', { username, password });
        const { token } = response.data;
        
        // Lưu token vào localStorage để duy trì đăng nhập
        localStorage.setItem('authToken', token);
        
        // Cập nhật state của user
        setUserFromToken(token);
        
        return token; // Trả về token cho LoginPage để xử lý điều hướng
    }, []);

    /**
     * Hàm xử lý đăng xuất
     */
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setUser(null);
    }, []);

    // Cung cấp các giá trị (user, loading, login, logout) cho các component con
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};