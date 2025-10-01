import { 
    IconDashboard, 
    IconCategory, 
    IconShoppingCart, 
    IconUsers, 
    IconMail, 
    IconReportMoney 
} from '@tabler/icons-react';

const adminMenu = {
  id: 'group-admin-management',
  title: 'ECommerce', // Tiêu đề này sẽ hiện ra trên sidebar
  type: 'group',
  
  children: [
    {
      id: 'dashboard', // id duy nhất cho mỗi item
      title: 'Dashboard', // Tên hiển thị trên menu
      type: 'item', // Loại: 'item' là một link đơn, 'collapse' là menu có con
      url: '/admin/dashboard', // Đường dẫn mà link sẽ trỏ đến
      icon: IconDashboard, // Icon hiển thị bên cạnh
      breadcrumbs: false // Tùy chọn của Berry, cứ để false
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/admin/categories',
      icon: IconCategory,
      breadcrumbs: false
    },
    {
      id: 'products',
      title: 'Products',
      type: 'item',
      url: '/admin/products',
      icon: IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/admin/users',
      icon: IconUsers,
      breadcrumbs: false
    },
    {
        id: 'orders',
        title: 'Orders',
        type: 'item',
        url: '/admin/orders',
        icon: IconReportMoney,
        breadcrumbs: false
    },
    {
        id: 'marketing',
        title: 'Marketing',
        type: 'item',
        url: '/admin/marketing', // Sẽ trỏ đến trang layout của marketing
        icon: IconMail,
        breadcrumbs: false
    }
  ]
};

export default adminMenu;