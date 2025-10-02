import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Box,
    CircularProgress,
    Avatar,
    Card,
    CardContent,
    Tabs,
    Tab,
    Alert,
    Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

// Component con để quản lý nội dung của từng Tab
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ProfilePage = () => {
    // State cho thông tin cá nhân
    const [profile, setProfile] = useState({ fullName: '', email: '', userName: '' });
    // State cho việc đổi mật khẩu
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    
    // State quản lý trạng thái loading và saving
    const [loading, setLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // State để quản lý Tab đang hoạt động
    const [activeTab, setActiveTab] = useState(0);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/profile');
            setProfile(response.data);
        } catch (error) {
            toast.error("Failed to load your profile information.");
            console.error("Failed to load profile:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleProfileChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            await api.put('/profile', profile);
            toast.success("Profile updated successfully!");
        } catch (error) {
            const errorMessages = error.response?.data?.map(err => err.description).join('\n') || "Failed to update profile.";
            toast.error(errorMessages);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirmation password do not match.");
            return;
        }
        if (passwordData.newPassword.length < 6) {
             toast.error("New password must be at least 6 characters long.");
            return;
        }
        setIsSavingPassword(true);
        try {
            await api.post('/profile/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password changed successfully!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
        } catch (error) {
            const errorMessages = error.response?.data?.map(err => err.description).join('\n') || "Failed to change password. Please check your current password.";
            toast.error(errorMessages);
        } finally {
            setIsSavingPassword(false);
        }
    };
    
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Profile
            </Typography>

            <Grid container spacing={4}>
                {/* --- CỘT BÊN TRÁI: AVATAR VÀ TÊN --- */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ width: 120, height: 120, margin: '0 auto 16px', bgcolor: 'primary.main', fontSize: '4rem' }}>
                           {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: '4rem' }} />}
                        </Avatar>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {profile.fullName}
                        </Typography>
                        <Typography color="text.secondary">
                            @{profile.userName}
                        </Typography>
                    </Paper>
                </Grid>

                {/* --- CỘT BÊN PHẢI: FORM VỚI TABS --- */}
                <Grid item xs={12} md={8}>
                    <Paper>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs" variant="fullWidth">
                                <Tab label="Personal Information" icon={<PersonIcon />} iconPosition="start" id="profile-tab-0" />
                                <Tab label="Security" icon={<LockIcon />} iconPosition="start" id="profile-tab-1" />
                            </Tabs>
                        </Box>
                        
                        {/* --- TAB THÔNG TIN CÁ NHÂN --- */}
                        <TabPanel value={activeTab} index={0}>
                            <Box component="form" onSubmit={handleUpdateProfile} noValidate>
                                <Typography variant="h6" gutterBottom>Edit Your Profile</Typography>
                                <TextField name="fullName" label="Full Name" value={profile.fullName} onChange={handleProfileChange} fullWidth required margin="normal" />
                                <TextField name="userName" label="Username" value={profile.userName} onChange={handleProfileChange} fullWidth required margin="normal" />
                                <TextField name="email" label="Email" type="email" value={profile.email} onChange={handleProfileChange} fullWidth required margin="normal" />
                                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSavingProfile}>
                                    {isSavingProfile ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                                </Button>
                            </Box>
                        </TabPanel>

                        {/* --- TAB THAY ĐỔI MẬT KHẨU --- */}
                        <TabPanel value={activeTab} index={1}>
                            <Box component="form" onSubmit={handleChangePassword} noValidate>
                                <Typography variant="h6" gutterBottom>Change Your Password</Typography>
                                 <Alert severity="info" sx={{ mb: 2 }}>
                                    Enter your current and new password. New password must be at least 6 characters long.
                                </Alert>
                                <TextField name="currentPassword" label="Current Password" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} fullWidth required margin="normal" />
                                <TextField name="newPassword" label="New Password" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} fullWidth required margin="normal" />
                                <TextField name="confirmPassword" label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} fullWidth required margin="normal" />
                                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSavingPassword}>
                                    {isSavingPassword ? 'Changing...' : 'Change Password'}
                                </Button>
                            </Box>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProfilePage;