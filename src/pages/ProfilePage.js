import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, Box, CircularProgress, Divider } from '@mui/material';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [profile, setProfile] = useState({ fullName: '', email: '', userName: '' });
    const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoadingProfile(true);
        try {
            const response = await api.get('/profile');
            setProfile(response.data);
        } catch (error) {
            toast.error("Failed to load profile.");
        } finally {
            setLoadingProfile(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleProfileChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPassword(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await api.put('/profile', profile);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setSavingPassword(true);
        try {
            await api.post('/profile/change-password', {
                currentPassword: password.currentPassword,
                newPassword: password.newPassword,
            });
            toast.success("Password changed successfully!");
            setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error("Failed to change password. Check your current password.");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loadingProfile) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>My Profile</Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Box component="form" onSubmit={handleUpdateProfile}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><TextField name="fullName" label="Full Name" value={profile.fullName} onChange={handleProfileChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField name="userName" label="Username" value={profile.userName} onChange={handleProfileChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField name="email" label="Email" type="email" value={profile.email} onChange={handleProfileChange} fullWidth /></Grid>
                    </Grid>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={savingProfile}>
                        {savingProfile ? 'Saving...' : 'Save Profile'}
                    </Button>
                </Box>
            </Paper>
            <Paper sx={{ p: 3 }}>
                 <Box component="form" onSubmit={handleChangePassword}>
                    <Typography variant="h6" gutterBottom>Change Password</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><TextField name="currentPassword" label="Current Password" type="password" value={password.currentPassword} onChange={handlePasswordChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField name="newPassword" label="New Password" type="password" value={password.newPassword} onChange={handlePasswordChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField name="confirmPassword" label="Confirm New Password" type="password" value={password.confirmPassword} onChange={handlePasswordChange} fullWidth /></Grid>
                    </Grid>
                     <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={savingPassword}>
                        {savingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProfilePage;