import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api/axiosConfig';

// Material-UI Components
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
    CircularProgress
} from '@mui/material';

// Toast Notifications
import { toast } from 'react-toastify';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Custom Components
import ProductFormDialog from '../../../components/admin/product/ProductFormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const ProductListPage = () => {
    // State quản lý dữ liệu và UI
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Hàm lấy danh sách sản phẩm từ API
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Trang admin sẽ lấy tất cả sản phẩm, có thể đặt pageSize rất lớn
            const response = await api.get('/admin/products', { params: { pageSize: 1000 } });
            
            // XỬ LÝ AN TOÀN: Đảm bảo dữ liệu trả về là một mảng
            if (response.data && Array.isArray(response.data.items)) {
                setProducts(response.data.items);
            } else {
                setProducts([]);
                toast.error("Invalid data format received from the server.");
            }
        } catch (error) {
            toast.error("Failed to fetch products.");
            setProducts([]); // Đặt thành mảng rỗng nếu có lỗi
        } finally {
            setLoading(false);
        }
    }, []);

    // Chạy hàm fetchProducts khi component được mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Handlers cho Dialog Thêm/Sửa Sản phẩm ---
    const handleOpenProductForm = (product = null) => {
        setSelectedProduct(product);
        setIsProductFormOpen(true);
    };

    const handleCloseProductForm = () => {
        setIsProductFormOpen(false);
        setSelectedProduct(null);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (productData.id) { // Chế độ Sửa
                await api.put(`/admin/products/${productData.id}`, productData);
                toast.success('Product updated successfully!');
            } else { // Chế độ Thêm mới
                await api.post('/admin/products', productData);
                toast.success('Product added successfully!');
            }
            fetchProducts(); // Tải lại danh sách
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save product.");
        } finally {
            handleCloseProductForm();
        }
    };

    // --- Handlers cho Dialog Xác nhận Xóa ---
    const handleOpenConfirm = (product) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setProductToDelete(null);
        setIsConfirmOpen(false);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            await api.delete(`/admin/products/${productToDelete.id}`);
            toast.success('Product deleted successfully!');
            fetchProducts(); // Tải lại danh sách
        } catch (error) {
            toast.error("Failed to delete product.");
        } finally {
            handleCloseConfirm();
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
                <Typography variant="h4" component="h1">Product Management</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenProductForm()}>
                    Add New Product
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* SỬ DỤNG OPTIONAL CHAINING ĐỂ AN TOÀN */}
                            {products?.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell component="th" scope="row">{product.name}</TableCell>
                                    <TableCell>{product.categoryName}</TableCell>
                                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                                    <TableCell align="right">{product.stock}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenProductForm(product)}><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => handleOpenConfirm(product)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ProductFormDialog
                open={isProductFormOpen}
                onClose={handleCloseProductForm}
                onSave={handleSaveProduct}
                product={selectedProduct}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleDeleteProduct}
                title="Delete Product"
                message={`Are you sure you want to permanently delete the product "${productToDelete?.name}"?`}
            />
        </Container>
    );
};

export default ProductListPage;