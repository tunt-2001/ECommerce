import React, { useState, useContext, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    // Contexts and navigation
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State for the form
    const [shippingInfo, setShippingInfo] = useState({ fullName: '', address: '', phoneNumber: '' });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    // State for the QR Code Modal
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrCodeData, setQrCodeData] = useState({ orderId: null, imageBase64: '' });

    // Redirect if cart is empty
    useEffect(() => {
        if (!loading && cartItems.length === 0) {
            toast.info("Your cart is empty. Let's go shopping!");
            navigate('/');
        }
    }, [cartItems, navigate, loading]);

    // === HÀM BỊ THIẾU ĐÃ ĐƯỢC THÊM VÀO ĐÂY ===
    /**
     * Handles changes in the shipping information form fields.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handles the main order placement logic
     */
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            shippingAddress: `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.phoneNumber}`,
            paymentMethod: paymentMethod,
            orderItems: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await api.post('/orders', orderData);
            const { orderId, qrCodeImageBase64 } = response.data;

            if (paymentMethod === 'QRCode' && qrCodeImageBase64) {
                setQrCodeData({ orderId, imageBase64: qrCodeImageBase64 });
                setIsQrModalOpen(true);
            } else {
                toast.success(`Order #${orderId} placed successfully!`);
                clearCart();
                navigate('/my-orders');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order.");
            console.error("Place order error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    /**
     * Handles closing the QR Code modal and completing the order flow
     */
    const handleQrModalClose = () => {
        setIsQrModalOpen(false);
        clearCart();
        navigate('/my-orders');
    };

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Checkout
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box component="form" id="checkout-form" onSubmit={handlePlaceOrder}>
                                <Typography variant="h6" gutterBottom>Shipping Information</Typography>
                                <TextField required fullWidth label="Full Name" name="fullName" value={shippingInfo.fullName} onChange={handleChange} margin="normal" />
                                <TextField required fullWidth label="Shipping Address" name="address" value={shippingInfo.address} onChange={handleChange} margin="normal" multiline rows={2} />
                                <TextField required fullWidth label="Phone Number" name="phoneNumber" value={shippingInfo.phoneNumber} onChange={handleChange} margin="normal" />
                            </Box>
                        </Paper>
                        <Paper sx={{ p: 3 }}>
                             <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend">Payment Method</FormLabel>
                                <RadioGroup name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                                    <FormControlLabel value="QRCode" control={<Radio />} label="Scan QR Code to Pay" />
                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Order Summary</Typography>
                            <List disablePadding>
                                {cartItems.map(item => (
                                    <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                                        <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                                        <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                                    </ListItem>
                                ))}
                                <Divider sx={{ my: 2 }} />
                                <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Total" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</Typography>
                                </ListItem>
                            </List>
                            <Button
                                type="submit"
                                form="checkout-form"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={loading || !user}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
                            </Button>
                            {!user && <Typography color="error" sx={{mt: 1}} align="center">Please log in to place an order.</Typography>}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={isQrModalOpen} onClose={handleQrModalClose}>
                <DialogTitle>Scan to Complete Payment</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <DialogContentText>
                        Your order #{qrCodeData.orderId} has been created. Please scan the QR code below with your banking app to pay.
                        The order will be processed after payment is confirmed.
                    </DialogContentText>
                    {qrCodeData.imageBase64 && (
                        <img 
                            src={qrCodeData.imageBase64} 
                            alt={`QR Code for Order ${qrCodeData.orderId}`}
                            style={{ width: '250px', height: '250px', marginTop: '16px' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleQrModalClose} variant="contained">I have Paid / Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CheckoutPage;