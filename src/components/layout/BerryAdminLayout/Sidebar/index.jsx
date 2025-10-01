import { memo, useMemo } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// Material-UI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; // Import CSS cho scrollbar

// project imports
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';
import { drawerWidth } from '../../../../store/constant';

// ==============================|| SIDEBAR DRAWER ||============================== //

// 1. SỬA LẠI ĐỂ NHẬN PROPS: `drawerOpen` và `drawerToggle`
const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  // Bỏ đi tất cả logic liên quan đến Redux và useConfig
  // const { menuMaster } = useGetMenuMaster();
  // const drawerOpen = menuMaster.isDashboardDrawerOpened;
  // const { miniDrawer } = useConfig();
  // Để đơn giản, ta sẽ giả định miniDrawer là false
  const miniDrawer = false; 

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawer = useMemo(() => {
    return (
      <PerfectScrollbar
        component="div"
        style={{
          height: !downMD ? 'calc(100vh - 88px)' : 'calc(100vh - 56px)',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}
      >
        <MenuList />
      </PerfectScrollbar>
    );
  }, [downMD]);

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: downMD ? 'auto' : drawerWidth }} aria-label="mailbox folders">
        {/* Logic hiển thị drawer cho mobile và desktop */}
        <Drawer
          container={container}
          // 2. SỬ DỤNG `drawerToggle` cho cả onClose và variant
          variant={downMD ? 'temporary' : 'persistent'} 
          anchor="left"
          // 3. SỬ DỤNG `drawerOpen` từ props
          open={drawerOpen} 
          onClose={drawerToggle} 
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderRight: 'none',
              [theme.breakpoints.up('md')]: {
                top: '88px'
              }
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {downMD && logo}
          {drawer}
        </Drawer>
    </Box>
  );
};

// 4. THÊM PropTypes
Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default memo(Sidebar);