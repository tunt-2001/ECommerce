import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import debounce from 'lodash.debounce';

// Material-UI Components
import {
    Container, Typography, Grid, Card, CardContent, CardMedia,
    CardActions, Button, CircularProgress, Box, TextField,
    Select, MenuItem, FormControl, InputLabel, Pagination, Paper, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Custom imports
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';

const HomePage = () => {
    // State quản lý dữ liệu chính
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State quản lý các tham số sẽ được gửi lên API
    const [filters, setFilters] = useState({
        searchTerm: '',
        categoryId: '',
        sortBy: 'name',
        pageNumber: 1,
        pageSize: 9,
    });

    // State riêng chỉ để điều khiển giá trị của ô input tìm kiếm
    const [searchTermInput, setSearchTermInput] = useState('');

    // State quản lý thông tin phân trang trả về từ API
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        totalPages: 1,
    });

    // Lấy hàm addToCart từ CartContext
    const { addToCart } = useContext(CartContext);

    // Hàm gọi API để lấy sản phẩm
    const fetchProducts = useCallback(async (currentFilters) => {
        setLoading(true);
        try {
            const response = await api.get('/products', { params: currentFilters });
            if (response.data && Array.isArray(response.data.items)) {
                setProducts(response.data.items);
                setPagination({
                    pageNumber: response.data.pageNumber,
                    totalPages: response.data.totalPages,
                });
            } else {
                setProducts([]);
            }
        } catch (error) {
            toast.error("Could not fetch products.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Tạo một phiên bản "debounced" của hàm fetchProducts.
    // useMemo đảm bảo hàm debounced này chỉ được tạo một lần.
    const debouncedFetch = useMemo(() =>
        debounce((currentFilters) => fetchProducts(currentFilters), 500)
    , [fetchProducts]);

    // useEffect này sẽ theo dõi state `filters` và gọi API
    useEffect(() => {
        debouncedFetch(filters);
        // Cleanup function: Hủy bỏ debounce request nếu component bị unmount
        return () => {
            debouncedFetch.cancel();
        };
    }, [filters, debouncedFetch]);

    // useEffect này chỉ chạy một lần để lấy danh sách danh mục cho bộ lọc
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/admin/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories for filter");
            }
        };
        fetchCategories();
    }, []);

    // Xử lý khi người dùng gõ vào ô tìm kiếm
    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTermInput(newSearchTerm);
        setFilters(prev => ({ ...prev, searchTerm: newSearchTerm, pageNumber: 1 }));
    };
    
    // Xử lý khi người dùng thay đổi các bộ lọc Select
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, pageNumber: 1 }));
    };
    
    // Xử lý khi người dùng chuyển trang
    const handlePageChange = (event, value) => {
        setFilters(prev => ({ ...prev, pageNumber: value }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to our Store!
            </Typography>

            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    label="Search products..."
                    variant="outlined"
                    size="small"
                    value={searchTermInput}
                    onChange={handleSearchChange}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Category</InputLabel>
                    <Select name="categoryId" value={filters.categoryId} label="Category" onChange={handleFilterChange}>
                        <MenuItem value=""><em>All Categories</em></MenuItem>
                        {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select name="sortBy" value={filters.sortBy} label="Sort By" onChange={handleFilterChange}>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="price_asc">Price: Low to High</MenuItem>
                        <MenuItem value="price_desc">Price: High to Low</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            {loading ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress size={60} /></Box>
            ) : (
                <>
                    <Grid container spacing={4}>
                       {products.length > 0 ? products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia component="img" height="240" image={product.imageUrl || `https://source.unsplash.com/random/400x300?product&sig=${product.id}`} alt={product.name} sx={{ objectFit: 'cover' }}/>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">{product.name}</Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">{product.categoryName}</Typography>
                                        <Typography variant="h6" component="p">${product.price ? product.price.toFixed(2) : '0.00'}</Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between' }}>
                                        <Button size="small" component={RouterLink} to={`/products/${product.id}`}>View Details</Button>
                                        <Button size="small" variant="contained" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                       )) : (
                            <Grid item xs={12}>
                                <Typography align="center" sx={{ my: 10 }}>No products found matching your criteria.</Typography>
                            </Grid>
                       )}
                    </Grid>

                    {pagination.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination count={pagination.totalPages} page={pagination.pageNumber} onChange={handlePageChange} color="primary" />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default HomePage;