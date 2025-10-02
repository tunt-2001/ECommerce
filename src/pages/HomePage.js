import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

// Material-UI Components
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    CircularProgress,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Custom Components & Contexts
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import ProductCarousel from '../components/ProductCarousel';

const HomePage = () => {
    // State quản lý dữ liệu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    // State quản lý bộ lọc và phân trang
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        searchTerm: searchParams.get('searchTerm') || '',
        categoryId: searchParams.get('categoryId') || '',
        sortBy: 'name',
        pageNumber: 1,
        pageSize: 9,
    });
    const [searchTermInput, setSearchTermInput] = useState(filters.searchTerm);
    const [pagination, setPagination] = useState({ pageNumber: 1, totalPages: 1 });
    
    // Lấy các context
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

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
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);
    
    const debouncedFetch = useMemo(() => debounce(fetchProducts, 500), [fetchProducts]);

    useEffect(() => {
        debouncedFetch(filters);
        setSearchParams({ categoryId: filters.categoryId, searchTerm: filters.searchTerm }, { replace: true });
        return () => debouncedFetch.cancel();
    }, [filters, debouncedFetch, setSearchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/admin/categories');
                setCategories(response.data);
            } catch (error) { console.error("Failed to fetch categories"); }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const categoryIdFromUrl = searchParams.get('categoryId');
        if (categoryIdFromUrl) {
            setFilters(prev => ({ ...prev, categoryId: categoryIdFromUrl, pageNumber: 1, searchTerm: '' }));
            setSearchTermInput('');
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (user) {
                try {
                    const response = await api.get('/wishlist');
                    setWishlist(response.data);
                } catch (error) { console.error("Failed to fetch wishlist", error); }
            } else {
                setWishlist([]);
            }
        };
        fetchWishlist();
    }, [user]);

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.info("Please log in to add items to your wishlist.");
            return;
        }
        try {
            const response = await api.post(`/wishlist/${productId}`);
            if (response.data.isAdded) {
                setWishlist(prev => [...prev, productId]);
                toast.success("Added to wishlist!");
            } else {
                setWishlist(prev => prev.filter(id => id !== productId));
                toast.info("Removed from wishlist.");
            }
        } catch (error) {
            toast.error("Failed to update wishlist.");
        }
    };
    
    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTermInput(newSearchTerm);
        setFilters(prev => ({ ...prev, searchTerm: newSearchTerm, pageNumber: 1 }));
    };
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, pageNumber: 1 }));
    };
    const handlePageChange = (event, value) => {
        setFilters(prev => ({ ...prev, pageNumber: value }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {filters.pageNumber === 1 && !filters.categoryId && !filters.searchTerm && (
                <Box sx={{ mb: 5 }}>
                   <ProductCarousel products={products} />
                </Box>
            )}
            <Typography variant="h4" component="h2" gutterBottom>All Products</Typography>
            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField label="Search products..." variant="outlined" size="small" value={searchTermInput} onChange={handleSearchChange} sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }} />
                <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Category</InputLabel><Select name="categoryId" value={filters.categoryId} label="Category" onChange={handleFilterChange}><MenuItem value=""><em>All Categories</em></MenuItem>{categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}</Select></FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Sort By</InputLabel><Select name="sortBy" value={filters.sortBy} label="Sort By" onChange={handleFilterChange}><MenuItem value="name">Name</MenuItem><MenuItem value="price_asc">Price: Low to High</MenuItem><MenuItem value="price_desc">Price: High to Low</MenuItem></Select></FormControl>
            </Paper>
            {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress size={60} /></Box> ) : (
                <>
                    <Grid container spacing={3}>
                       {products.length > 0 ? products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia component="div" sx={{ aspectRatio: '1 / 1', backgroundImage: `url(${product.imageUrl || `https://source.unsplash.com/random/400x400?product&sig=${product.id}`})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                        <IconButton onClick={() => toggleWishlist(product.id)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.4)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' } }} aria-label="add to wishlist">
                                            {wishlist.includes(product.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography gutterBottom variant="h5" component="h2" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, minHeight: '3.2em', }}>
                                            {product.name}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, minHeight: '1.5em' }} color="text.secondary">{product.categoryName}</Typography>
                                        <Box sx={{ flexGrow: 1 }} /> 
                                        <Typography variant="h6" component="p">${product.price ? product.price.toFixed(2) : '0.00'}</Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                        <Button size="small" component={RouterLink} to={`/products/${product.id}`}>View Details</Button>
                                        <Button size="small" variant="contained" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                       )) : (
                            <Grid item xs={12}><Typography align="center" sx={{ my: 10 }}>No products found matching your criteria.</Typography></Grid>
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