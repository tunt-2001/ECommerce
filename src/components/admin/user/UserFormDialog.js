import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const UserFormDialog = ({ open, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });

    const [allRoles, setAllRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchAllRoles = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users/roles');
            setAllRoles(response.data.map(r => r.name));
        } catch (error) {
            toast.error("Failed to fetch roles");
            console.error("Failed to fetch roles", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchAllRoles();

            if (user) { // Chế độ Sửa
                setFormData({
                    // Backend trả về JSON dạng camelCase (userName)
                    username: user.userName || '', 
                    fullName: user.fullName || '',
                    email: user.email || '',
                    password: '' // Luôn để trống password khi sửa
                });
                setSelectedRoles(user.roles || []);
            } else { // Chế độ Thêm mới
                setFormData({ username: '', fullName: '', email: '', password: '' });
                setSelectedRoles(['User']); // Mặc định gán quyền 'User'
            }
        }
    }, [user, open, fetchAllRoles]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (event) => {
        const { name, checked } = event.target;
        setSelectedRoles(prev =>
            checked ? [...prev, name] : prev.filter(role => role !== name)
        );
    };

    const handleSave = async () => {
        setSaving(true);
        const dataToSend = { ...formData, roles: selectedRoles };
        
        if (user && !dataToSend.password) {
            // Nếu là sửa và không nhập pass mới, xóa trường password đi
            delete dataToSend.password;
        } else if (!user && !dataToSend.password) {
            toast.error("Password is required for new users.");
            setSaving(false);
            return;
        }
        
        await onSave({ id: user ? user.id : null, ...dataToSend });
        setSaving(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TextField name="username" label="Username" value={formData.username} onChange={handleFormChange} fullWidth margin="normal" required />
                        <TextField name="fullName" label="Full Name" value={formData.fullName} onChange={handleFormChange} fullWidth margin="normal" required />
                        <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleFormChange} fullWidth margin="normal" required />
                        
                        <TextField 
                            name="password" 
                            label={user ? "New Password (leave blank to keep current)" : "Password"}
                            type="password" 
                            value={formData.password} 
                            onChange={handleFormChange} 
                            fullWidth 
                            margin="normal" 
                            required={!user} 
                        />

                        <Typography sx={{ mt: 2, mb: 1 }}>Roles</Typography>
                        <FormGroup>
                            {allRoles.map(role => (
                                <FormControlLabel
                                    key={role}
                                    control={<Checkbox checked={selectedRoles.includes(role)} onChange={handleRoleChange} name={role} />}
                                    label={role}
                                />
                            ))}
                        </FormGroup>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserFormDialog;