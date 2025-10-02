import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Badge,
    ButtonBase,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Popper,
    Typography,
    CircularProgress,
    useMediaQuery
} from '@mui/material';

import MainCard from '../../../../../ui-component/cards/MainCard';
import Transitions from '../../../../../ui-component/extended/Transitions';
import { IconBell } from '@tabler/icons-react';

// ==============================|| NOTIFICATION SECTION ||============================== //

const NotificationSection = ({ notifications = [], onMarkAsRead, onNotificationClick, isLoading }) => {    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <Box sx={{ ml: 2, mr: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'notification-popper' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <IconBell stroke={1.5} size="1.3rem" />
                        </Badge>
                    </Avatar>
                </ButtonBase>
            </Box>
            
            <Popper
                placement={downMD ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? 5 : 0, 14] } }] }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">Notifications</Typography>
                                        {unreadCount > 0 && (
                                            <Typography 
                                                variant="caption" 
                                                component="a" 
                                                onClick={onMarkAsRead} // Gọi hàm từ props
                                                sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                                            >
                                                Mark all as read
                                            </Typography>
                                        )}
                                    </Box>
                                    <Divider />
                                    <List sx={{ width: '100%', maxWidth: 360, maxHeight: 400, overflowY: 'auto', bgcolor: 'background.paper' }}>
                                        {isLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>
                                        ) : notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <ListItemButton 
                                                    key={notif.id} 
                                                    sx={{ p: 2, bgcolor: notif.isRead ? 'action.hover' : 'transparent' }}
                                                    onClick={() => onNotificationClick(notif)} // Gọi hàm từ props
                                                >
                                                    <ListItemText 
                                                        primary={<Typography variant="body1" sx={{ fontWeight: notif.isRead ? 400 : 600 }}>{notif.message}</Typography>} 
                                                        secondary={<Typography variant="caption" color="text.secondary">{new Date(notif.createdDate).toLocaleString()}</Typography>}
                                                    />
                                                </ListItemButton>
                                            ))
                                        ) : (
                                            <ListItemText primary="No notifications" sx={{ textAlign: 'center', p: 3 }} />
                                        )}
                                    </List>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

// Định nghĩa các props mà component này yêu cầu
NotificationSection.propTypes = {
    notifications: PropTypes.array.isRequired,
    onMarkAsRead: PropTypes.func.isRequired,
    onNotificationClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default NotificationSection;