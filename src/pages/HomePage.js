import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Material-UI Components for a nice user interface
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
    Box 
} from '@mui/material';

// The centralized axios instance for making API calls
import api from '../api/axiosConfig';

// Toast notifications for user feedback
import { toast } from 'react-toastify';

// Import CartContext to use its functions (e.g., addToCart)
import { CartContext } from '../contexts/CartContext';

const HomePage = () => {
    // State to store the list of products fetched from the API
    const [products, setProducts] = useState([]);
    // State to manage the loading indicator while fetching data
    const [loading, setLoading] = useState(true);

    // Get the addToCart function from our CartContext
    const { addToCart } = useContext(CartContext);

    /**
     * Fetches the list of products from the public API endpoint.
     * useCallback is used to memoize the function, preventing it from being recreated on every render.
     */
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // The API endpoint for public product listing
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            toast.error("Could not fetch products. Please try again later.");
            console.error("Fetch products error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // The useEffect hook runs once when the component mounts to fetch initial data.
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /**
     * Renders a loading spinner while data is being fetched.
     */
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    /**
     * Renders the main content of the homepage.
     */
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                Welcome to our Store!
            </Typography>
            
            {/* Check if there are products to display */}
            {products.length > 0 ? (
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="240"
                                    // Using a placeholder image service with product ID for variety
                                    image={product.imageUrl || `https://source.unsplash.com/random/400x300?product&sig=${product.id}`}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {product.name}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {product.categoryName}
                                    </Typography>
                                    <Typography variant="h6" component="p">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Button 
                                        size="small" 
                                        component={RouterLink} 
                                        to={`/products/${product.id}`}
                                    >
                                        View Details
                                    </Button>
                                    {/* When this button is clicked, it calls the addToCart function from the context */}
                                    <Button 
                                        size="small" 
                                        variant="contained"
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Display a message if no products are found
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No products available at the moment. Please check back later!
                </Typography>
            )}
        </Container>
    );
};

export default HomePage;