import React, { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, CircularProgress, InputAdornment } from '@mui/material';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const NewsletterComposePage = () => {
    // State cho nội dung email
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // State quản lý trạng thái
    const [isUploading, setIsUploading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    /**
     * Hàm xử lý khi người dùng chọn một file ảnh để upload.
     */
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra kích thước file trước khi upload
        if (file.size > 5 * 1024 * 1024) { // Giới hạn 5MB
            toast.error("Image is too large. Maximum size is 5MB.");
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        setIsUploading(true);
        try {
            // Gọi đến endpoint upload, thêm tham số query `type=marketing`
            const response = await api.post('/uploads?type=marketing', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            // Lấy URL trả về và gán vào state, cũng như ô input
            setImageUrl(response.data.imageUrl);
            toast.success("Image uploaded successfully!");

        } catch (error) {
            toast.error(error.response?.data || "Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    };


    /**
     * Hàm xử lý khi Admin nhấn nút gửi email.
     */
    const handleSend = async () => {
        if (!subject || !body) {
            toast.error("Subject and body are required.");
            return;
        }
        setIsSending(true);
        try {
            const payload = { subject, body, imageUrl };
            await api.post('/admin/marketing/send-newsletter', payload);
            toast.success("Newsletter sent successfully!");
            // Reset form sau khi gửi thành công
            setSubject('');
            setBody('');
            setImageUrl('');
        } catch (error) {
            toast.error("Failed to send newsletter.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Send Newsletter
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        label="Subject"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        margin="normal"
                        required
                    />
                    
                    {/* --- PHẦN UPLOAD HÌNH ẢNH MỚI --- */}
                    <TextField
                        label="Image URL"
                        fullWidth
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        margin="normal"
                        placeholder="Or upload an image below to generate URL"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        component="label"
                                        size="small"
                                        disabled={isUploading}
                                        startIcon={isUploading ? <CircularProgress size={20} color="inherit"/> : <CloudUploadIcon />}
                                    >
                                        Upload
                                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </Button>
                                </InputAdornment>
                            )
                        }}
                    />
                    {/* Hiển thị ảnh preview nếu có */}
                    {imageUrl && (
                         <Box my={2} sx={{ textAlign: 'center' }}>
                            <img src={imageUrl} alt="Newsletter Preview" style={{ maxHeight: '250px', maxWidth: '100%', borderRadius: '8px' }} />
                        </Box>
                    )}

                    <TextField
                        label="Email Body"
                        fullWidth
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        margin="normal"
                        multiline
                        rows={10}
                        required
                        helperText="This is the main content of your email. You can use simple HTML tags like <p>, <b>, <i>..."
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSend}
                        disabled={isSending || isUploading}
                        sx={{ mt: 2 }}
                    >
                        {isSending ? <CircularProgress size={24} /> : "Send to All Users"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NewsletterComposePage;