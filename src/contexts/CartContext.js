import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart data from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Could not save cart data to localStorage", error);
        }
    }, [cartItems]);
    
    /**
     * Thêm một sản phẩm vào giỏ hàng.
     * @param {object} product - Đối tượng sản phẩm đầy đủ thông tin (id, name, price...).
     */
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, chỉ cần tăng số lượng (quantity) lên 1.
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Nếu sản phẩm chưa có trong giỏ, thêm nó vào danh sách với số lượng là 1.
            return [...prevItems, { ...product, quantity: 1 }];
        });
        toast.success(`"${product.name}" added to cart!`);
    };

    /**
     * Xóa hoàn toàn một sản phẩm (dù số lượng là bao nhiêu) khỏi giỏ hàng.
     * @param {number} productId - ID của sản phẩm cần xóa.
     */
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        toast.info("Item removed from cart.");
    };

    /**
     * Cập nhật số lượng của một sản phẩm cụ thể trong giỏ.
     * @param {number} productId - ID của sản phẩm.
     * @param {number} quantity - Số lượng mới.
     */
    const updateQuantity = (productId, quantity) => {
        // Đảm bảo số lượng không bao giờ nhỏ hơn 1.
        const newQuantity = Math.max(1, quantity);
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    
    /**
     * Xóa tất cả các sản phẩm khỏi giỏ hàng.
     * Thường được gọi sau khi thanh toán thành công.
     */
    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const value = { 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        cartCount, 
        cartTotal 
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};