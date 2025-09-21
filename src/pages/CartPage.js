import React, { useContext } from 'react';
import { 
    Container, 
    Typography, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton, 
    Box, 
    TextField 
} from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h4" gutterBottom>Your cart is empty.</Typography>
                    <Typography color="text.secondary">Looks like you haven't added anything to your cart yet.</Typography>
                    <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>
                        Go Shopping
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Shopping Cart</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="center">Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                        sx={{ width: '80px' }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => removeFromCart(item.id)} color="error" aria-label="remove item">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Button onClick={clearCart} color="error">
                    Clear Cart
                </Button>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5">Total: ${cartTotal.toFixed(2)}</Typography>
                    <Button component={RouterLink} to="/checkout" variant="contained" size="large" sx={{ mt: 2 }}>
                        Proceed to Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CartPage;