import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, CircularProgress, Tooltip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const NewsletterHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/marketing/history');
            setHistory(response.data);
        } catch (error) {
            toast.error("Could not fetch newsletter history.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Newsletter History
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sent Date</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell align="right">Recipients</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{new Date(item.sentDate).toLocaleString()}</TableCell>
                                    <TableCell>{item.subject}</TableCell>
                                    <TableCell>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="Thumbnail" style={{ height: '40px', borderRadius: '4px' }} />
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                    <TableCell align="right">{item.recipientCount}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Preview Email">
                                            <IconButton>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default NewsletterHistoryPage;