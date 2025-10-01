import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

import MainCard from '../../../../../ui-component/cards/MainCard';
import Transitions from '../../../../../ui-component/extended/Transitions';
import { AuthContext } from '../../../../../contexts/AuthContext'; // Import AuthContext
import { IconLogout, IconSettings } from '@tabler/icons-react';
import User1 from '../../../../../assets/images/users/user-round.svg'; // Ảnh avatar mặc định

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State để quản lý việc mở/đóng menu dropdown
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  // Lấy thông tin user và hàm logout từ AuthContext
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '& .MuiChip-label': { lineHeight: 0 },
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '& svg': { stroke: theme.palette.primary.light }
          }
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              width: '34px',
              height: '34px',
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'profile-popper' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'profile-popper' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      {/* Menu Dropdown khi click vào Avatar */}
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [0, 14] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Good Morning,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {user ? user.username : 'Admin'}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">Project Admin</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <List component="nav">
                      <ListItemButton sx={{ borderRadius: `8px` }} onClick={handleLogout}>
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;