import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, CardMedia, Button, Box, CircularProgress } from '@mui/material';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy 'id' từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            toast.error("Could not fetch product details.");
            console.error("Fetch product detail error:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!product) {
        return <Typography variant="h5" align="center" sx={{ mt: 4 }}>Product not found.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <CardMedia
                        component="img"
                        image={product.imageUrl || `https://source.unsplash.com/random?sig=${product.id}`}
                        alt={product.name}
                        sx={{ width: '100%', borderRadius: 2 }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" gutterBottom>{product.name}</Typography>
                    <Typography variant="h5" color="primary" gutterBottom>${product.price.toFixed(2)}</Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        <strong>Category:</strong> {product.categoryName}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description || "No description available."}
                    </Typography>
                    <Typography variant="body2" color={product.stock > 0 ? 'green' : 'red'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" size="large" disabled={product.stock === 0}>
                            Add to Cart
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailPage;