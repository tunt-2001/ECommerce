import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        // <React.StrictMode>
        <AuthProvider>
            <CartProvider> {}
                <App />
            </CartProvider>
        </AuthProvider>
    // </React.StrictMode>
);