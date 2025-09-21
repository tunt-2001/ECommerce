import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    CircularProgress,
    Typography
} from '@mui/material';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const ProductFormDialog = ({ open, onClose, onSave, product }) => {
    // State để quản lý toàn bộ dữ liệu của form
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: '',
        imageUrl: ''
    });
    
    // State để lưu danh sách các danh mục lấy từ API
    const [categories, setCategories] = useState([]);
    
    // State để quản lý trạng thái loading
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Lấy danh sách danh mục từ API để hiển thị trong dropdown.
     * Dùng useCallback để tránh hàm này bị tạo lại không cần thiết.
     */
    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const response = await api.get('/admin/categories');
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories.");
            console.error("Failed to fetch categories for form", error);
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    // Effect này chạy mỗi khi dialog được mở (prop `open` thay đổi)
    useEffect(() => {
        if (open) {
            // Lấy danh sách danh mục
            fetchCategories();

            // Nếu có `product` được truyền vào (chế độ Sửa)
            if (product) {
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || 0,
                    stock: product.stock || 0,
                    categoryId: product.categoryId || '',
                    imageUrl: product.imageUrl || ''
                });
            } else { // Chế độ Thêm mới, reset form
                setFormData({ name: '', description: '', price: 0, stock: 0, categoryId: '', imageUrl: '' });
            }
        }
    }, [product, open, fetchCategories]);

    /**
     * Xử lý sự thay đổi giá trị của các ô input (TextField, Select)
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Xử lý sự kiện khi người dùng chọn một file ảnh để upload
     */
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra kích thước file (ví dụ: tối đa 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large. Maximum size is 5MB.");
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        setIsUploading(true);
        try {
            const response = await api.post('/uploads', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Cập nhật state với URL ảnh trả về từ backend
            setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error(error.response?.data || "Image upload failed.");
            console.error("Image upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Gọi hàm onSave được truyền từ component cha khi người dùng nhấn nút "Save"
     */
    const handleSave = async () => {
        setIsSaving(true);
        await onSave({ id: product ? product.id : 0, ...formData });
        setIsSaving(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
                <TextField name="name" label="Product Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                <TextField name="price" label="Price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="normal" required InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} />
                <TextField name="stock" label="Stock" type="number" value={formData.stock} onChange={handleChange} fullWidth margin="normal" required />
                
                <FormControl fullWidth margin="normal" required disabled={isLoadingCategories}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        name="categoryId"
                        value={formData.categoryId}
                        label="Category"
                        onChange={handleChange}
                    >
                        {isLoadingCategories ? (
                            <MenuItem disabled><em>Loading categories...</em></MenuItem>
                        ) : (
                            categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                <Box mt={2}>
                    <Typography variant="subtitle1" gutterBottom>Product Image</Typography>
                    <Button variant="contained" component="label" disabled={isUploading}>
                        Upload Image
                        <input type="file" hidden accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} />
                    </Button>
                    {isUploading && <CircularProgress size={24} sx={{ ml: 2, verticalAlign: 'middle' }} />}
                </Box>
                
                {formData.imageUrl && (
                    <Box mt={2} sx={{ textAlign: 'center', border: '1px dashed grey', padding: 1, borderRadius: 2 }}>
                        <Typography variant="caption">Image Preview</Typography>
                        <img 
                            src={formData.imageUrl} 
                            alt="Product Preview" 
                            style={{ 
                                marginTop: '8px',
                                maxHeight: '200px', 
                                maxWidth: '100%', 
                                borderRadius: '4px',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }} 
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={isUploading || isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductFormDialog;