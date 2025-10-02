import React from 'react';
import Slider from 'react-slick';
import { Paper, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ProductCarousel = ({ products }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <Slider {...settings}>
            {products.slice(0, 5).map((product) => ( // Chỉ lấy 5 sản phẩm đầu
                <Paper key={product.id} sx={{ position: 'relative', height: '400px', color: '#fff' }}>
                    <Box
                        component="img"
                        src={product.imageUrl || `https://source.unsplash.com/random/1200x400?sig=${product.id}`}
                        alt={product.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
                    />
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <Typography variant="h3" component="h1" gutterBottom>{product.name}</Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>Now only ${product.price.toFixed(2)}</Typography>
                        <Button component={RouterLink} to={`/products/${product.id}`} variant="contained" size="large">Shop Now</Button>
                    </Box>
                </Paper>
            ))}
        </Slider>
    );
};
export default ProductCarousel;