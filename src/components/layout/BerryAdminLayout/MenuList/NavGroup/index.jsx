import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from '../NavItem';
// import NavCollapse from '../NavCollapse'; // Tạm thời không dùng menu collapse

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export default function NavGroup({ item }) {
  const theme = useTheme();

  // Lặp qua các menu item con và render chúng
  const items = item.children?.map((menu) => {
    switch (menu?.type) {
      // Hiện tại chúng ta chỉ có 'item', bạn có thể thêm 'collapse' sau nếu cần
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu?.id} variant="h6" color="error" align="center">
            Menu Item Error
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }}>
              {item.title}
            </Typography>
            {item.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }}>
                {item.caption}
              </Typography>
            )}
          </Box>
        )
      }
      sx={{ mb: 1.75, py: 0.25 }}
    >
      {items}
    </List>
  );
}

NavGroup.propTypes = {
  item: PropTypes.object
};