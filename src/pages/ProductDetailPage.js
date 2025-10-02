import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

// Material-UI Components
import { 
    Container, 
    Typography, 
    Grid, 
    CardMedia, 
    Button, 
    Box, 
    CircularProgress, 
    TextField,
    Divider,
    Paper
} from '@mui/material';

// Custom Components & Contexts
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy 'id' từ URL (ví dụ: /products/5)
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // State để quản lý số lượng
    const { addToCart } = useContext(CartContext);

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            // Gọi API để lấy chi tiết sản phẩm theo ID
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            toast.error("Could not fetch product details.");
            console.error("Fetch product detail error:", error);
        } finally {
            setLoading(false);
        }
    }, [id]); // Chạy lại hàm này mỗi khi `id` trên URL thay đổi

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    /**
     * Xử lý khi người dùng thay đổi số lượng trong ô input
     */
    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value);
        // Đảm bảo số lượng là một số hợp lệ, lớn hơn 0 và không vượt quá tồn kho
        if (!isNaN(value) && value > 0) {
            setQuantity(Math.min(value, product.stock));
        } else {
            setQuantity(1); // Nếu nhập không hợp lệ, quay về 1
        }
    };

    /**
     * Xử lý khi người dùng nhấn nút "Add to Cart"
     */
    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress size={60} /></Box>;
    }

    if (!product) {
        return (
            <Container>
                <Typography variant="h5" align="center" sx={{ mt: 4 }}>
                    Product not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    {/* Cột hình ảnh */}
                    <Grid item xs={12} md={6}>
                        <CardMedia
                            component="img"
                            image={product.imageUrl || `https://source.unsplash.com/random/800x800?product&sig=${product.id}`}
                            alt={product.name}
                            sx={{ width: '100%', borderRadius: 2, border: '1px solid #ddd' }}
                        />
                    </Grid>

                    {/* Cột thông tin sản phẩm */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h1" gutterBottom>{product.name}</Typography>
                        <Typography variant="body1" color="text.secondary" component={RouterLink} to={`/?categoryId=${product.categoryId}`} sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            {product.categoryName}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {product.description || "No description available."}
                        </Typography>
                        <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Typography>
                        
                        {/* Phần chọn số lượng và thêm vào giỏ */}
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                label="Qty"
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                InputProps={{ inputProps: { min: 1, max: product.stock } }}
                                sx={{ width: '100px' }}
                                size="small"
                                disabled={product.stock === 0}
                            />
                            <Button 
                                variant="contained" 
                                size="large" 
                                disabled={product.stock === 0} 
                                onClick={handleAddToCart}
                                sx={{ flexGrow: 1 }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Khu vực cho các tính năng nâng cao sau này */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>Related Products</Typography>
                {/* Logic hiển thị sản phẩm liên quan sẽ được thêm vào đây */}
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Customer Reviews</Typography>
                {/* Logic hiển thị và thêm review sẽ được thêm vào đây */}
            </Box>
        </Container>
    );
};

export default ProductDetailPage;