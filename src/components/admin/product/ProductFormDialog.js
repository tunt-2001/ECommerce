import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../../../api/axiosConfig';

const ProductFormDialog = ({ open, onClose, onSave, product }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: 0, stock: 0, categoryId: '' });
    const [categories, setCategories] = useState([]);

    // Lấy danh sách danh mục để hiển thị trong dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/admin/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories for form", error);
            }
        };
        if (open) {
            fetchCategories();
        }
    }, [open]);

    // Điền dữ liệu vào form khi mở ở chế độ Sửa
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                stock: product.stock || 0,
                categoryId: product.categoryId || ''
            });
        } else {
            setFormData({ name: '', description: '', price: 0, stock: 0, categoryId: '' });
        }
    }, [product, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({ id: product ? product.id : 0, ...formData });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
                <TextField name="name" label="Product Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                <TextField name="price" label="Price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="stock" label="Stock" type="number" value={formData.stock} onChange={handleChange} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        name="categoryId"
                        value={formData.categoryId}
                        label="Category"
                        onChange={handleChange}
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductFormDialog;