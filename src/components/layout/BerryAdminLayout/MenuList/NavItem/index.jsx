import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

export default function NavItem({ item, level }) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon stroke={1.5} size="1.3rem" /> : null;

  // Logic để xác định xem menu item có đang được chọn hay không
  const isSelected = !!(item.url && pathname.startsWith(item.url));

  return (
    <ListItemButton
      // Sử dụng Link của react-router-dom để điều hướng
      component={forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} />)}
      disabled={item.disabled}
      selected={isSelected}
      sx={{
        borderRadius: `8px`,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
        // Style khi được chọn
        '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark
            },
            '& .MuiListItemIcon-root': {
                color: 'white'
            }
        },
      }}
    >
      {itemIcon && (
        <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>
          {itemIcon}
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          <Typography variant={isSelected ? 'h5' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }}>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};