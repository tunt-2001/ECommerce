import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api/axiosConfig';
import {
    Container, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Box, Chip, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UserFormDialog from '../../../components/admin/user/UserFormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenUserForm = (user = null) => {
        setSelectedUser(user);
        setIsUserFormOpen(true);
    };

    const handleCloseUserForm = () => {
        setIsUserFormOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (userData.id) {
                await api.put(`/admin/users/${userData.id}`, userData);
                toast.success('User updated successfully!');
            } else {
                await api.post('/admin/users', userData);
                toast.success('User created successfully!');
            }
            fetchUsers();
        } catch (error) {
            // SỬA LẠI LOGIC XỬ LÝ LỖI ĐỂ TRÁNH CRASH
            let errorMessage = "An unknown error occurred.";
            if (error.response?.data) {
                const responseData = error.response.data;
                if (Array.isArray(responseData)) { // Trường hợp IdentityResult.Errors
                    errorMessage = responseData.map(e => e.description).join('\n');
                } else if (responseData.message) { // Trường hợp BadRequest("message")
                    errorMessage = responseData.message;
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData;
                }
            }
            toast.error(errorMessage);
            console.error("Save user error:", error.response);
        } finally {
            handleCloseUserForm();
        }
    };

    const handleOpenConfirm = (user) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setUserToDelete(null);
        setIsConfirmOpen(false);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/admin/users/${userToDelete.id}`);
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            let errorMessage = "Failed to delete user.";
             if (error.response?.data && Array.isArray(error.response.data)) {
                errorMessage = error.response.data.map(e => e.description).join('\n');
            }
            toast.error(errorMessage);
        } finally {
            handleCloseConfirm();
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
                <Typography variant="h4" component="h1">
                    User Management
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenUserForm()}>
                    Add New User
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{user.userName}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles.map(role => (
                                            <Chip label={role} key={role} color={role === 'Admin' ? 'primary' : 'default'} size="small" sx={{ mr: 1 }} />
                                        ))}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenUserForm(user)}><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => handleOpenConfirm(user)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <UserFormDialog
                open={isUserFormOpen}
                onClose={handleCloseUserForm}
                onSave={handleSaveUser}
                user={selectedUser}
            />
            
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleDeleteUser}
                title="Delete User"
                message={`Are you sure you want to permanently delete the user "${userToDelete?.fullName}"? This action cannot be undone.`}
            />
        </Container>
    );
};

export default UserListPage;