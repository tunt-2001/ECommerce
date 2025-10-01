import { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// project imports
import NavGroup from './NavGroup';
// Thay thế menu mặc định của Berry bằng menu của chính bạn
import adminMenu from '../../../../menu-items/adminMenu'; 

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const theme = useTheme();

  // Bây giờ chúng ta chỉ làm việc với một đối tượng menu đơn giản
  const menuItem = {
    items: [adminMenu] // Bọc menu của bạn trong một mảng items
  };

  // Logic render được đơn giản hóa rất nhiều
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        // Truyền trực tiếp item group vào NavGroup để nó tự render các con
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default memo(MenuList);