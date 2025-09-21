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
    // State để quản lý dữ liệu của form
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });

    // State để quản lý danh sách tất cả các Role có trong hệ thống
    const [allRoles, setAllRoles] = useState([]);
    // State để quản lý các Role được chọn cho user hiện tại
    const [selectedRoles, setSelectedRoles] = useState([]);
    
    // State để quản lý trạng thái loading
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Dùng useCallback để tránh việc hàm được tạo lại không cần thiết
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

    // Effect này sẽ chạy mỗi khi dialog được mở
    useEffect(() => {
        if (open) {
            // Lấy danh sách tất cả các role
            fetchAllRoles();

            if (user) { // Chế độ Sửa: điền thông tin user hiện tại vào form
                setFormData({
                    username: user.username || '',
                    fullName: user.fullName || '',
                    email: user.email || '',
                    password: '' // Luôn để trống password khi sửa
                });
                setSelectedRoles(user.roles || []);
            } else { // Chế độ Thêm mới: reset form về trạng thái rỗng
                setFormData({ username: '', fullName: '', email: '', password: '' });
                setSelectedRoles(['User']); // Mặc định gán quyền 'User' cho người dùng mới
            }
        }
    }, [user, open, fetchAllRoles]);

    // Hàm xử lý khi người dùng thay đổi giá trị trong các ô TextField
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý khi người dùng tick/bỏ tick các Checkbox của Role
    const handleRoleChange = (event) => {
        const { name, checked } = event.target;
        setSelectedRoles(prev =>
            checked ? [...prev, name] : prev.filter(role => role !== name)
        );
    };

    // Hàm xử lý khi nhấn nút Save
    const handleSave = async () => {
        setSaving(true);
        // Chuẩn bị dữ liệu để gửi lên API
        const dataToSend = { ...formData, roles: selectedRoles };
        
        if (user) {
            // Nếu là chế độ sửa và người dùng không nhập password mới,
            // thì không gửi trường password lên backend.
            if (!dataToSend.password) {
                delete dataToSend.password;
            }
        } else {
            // Nếu là chế độ thêm mới, password là bắt buộc
            if (!dataToSend.password) {
                toast.error("Password is required for new users.");
                setSaving(false);
                return;
            }
        }
        
        // Gọi hàm onSave được truyền từ component cha (UserListPage)
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
                        
                        {/* Nếu là chế độ sửa, hiển thị một label khác cho password */}
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