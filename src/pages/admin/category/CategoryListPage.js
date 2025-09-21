import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryFormDialog from '../../../components/admin/category/CategoryFormDialog'; // 1. IMPORT COMPONENT DIALOG

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    // 2. THÊM CÁC STATE ĐỂ QUẢN LÝ DIALOG
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories');
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories.");
        }
    };

    // 3. THÊM CÁC HÀM ĐỂ XỬ LÝ DIALOG
    const handleOpenDialogEdit = (category = null) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleOpenDialogAdd = () => {
        setSelectedCategory(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const handleSave = async (categoryData) => {
        try {
            if (categoryData.id) {
                await api.put(`/admin/categories/${categoryData.id}`, { name: categoryData.name });
                toast.success('Category updated successfully!');
            } else {
                await api.post('/admin/categories', { name: categoryData.name });
                toast.success('Category added successfully!');
            }
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save category.");
        } finally {
            handleCloseDialog();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/admin/categories/${id}`);
                toast.success('Category deleted successfully!');
                fetchCategories();
            } catch (error) {
                const errorMessage = error.response?.data || "Failed to delete category. It may contain products.";
                toast.error(errorMessage);
            }
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 4 }}>
                <Typography variant="h4" component="h1">
                    Category Management
                </Typography>
                {/* 4. GÁN HÀM VÀO SỰ KIỆN ONCLICK CỦA NÚT */}
                <Button variant="contained" color="primary" onClick={handleOpenDialogAdd}>
                    Add New Category
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell align="right">
                                    {/* 5. GÁN HÀM VÀO SỰ KIỆN ONCLICK CỦA NÚT EDIT */}
                                    <IconButton color="primary" onClick={() => handleOpenDialogEdit(category)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(category.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 6. RENDER COMPONENT DIALOG */}
            <CategoryFormDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSave={handleSave}
                category={selectedCategory}
            />
        </Container>
    );
};

export default CategoryListPage;