import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductFormDialog from '../../../components/admin/product/ProductFormDialog';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data);
        } catch (error) {
            toast.error("Failed to fetch products.");
        }
    };
    
    const handleOpenDialog = (product = null) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
    };

    const handleSave = async (productData) => {
        try {
            if (productData.id) {
                await api.put(`/admin/products/${productData.id}`, productData);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/admin/products', productData);
                toast.success('Product added successfully!');
            }
            fetchProducts();
        } catch (error) {
            toast.error("Failed to save product.");
        } finally {
            handleCloseDialog();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                toast.success('Product deleted successfully!');
                fetchProducts();
            } catch (error) {
                toast.error("Failed to delete product.");
            }
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 4 }}>
                <Typography variant="h4" component="h1">Product Management</Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>Add New Product</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.categoryName}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenDialog(product)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ProductFormDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSave={handleSave}
                product={selectedProduct}
            />
        </Container>
    );
};

export default ProductListPage;