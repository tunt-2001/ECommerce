import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { DASHBOARD_PATH } from '../../../../config';
import Logo from '../../../../ui-component/Logo';

export default function LogoSection() {
  return (
    <Link component={RouterLink} to="/admin/dashboard" aria-label="theme-logo">
      <Logo />
    </Link>
  );
}
