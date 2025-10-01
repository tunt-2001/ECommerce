import { colors } from '@mui/material';

const Palette = (navType) => {
  return {
    mode: navType,
    common: {
      black: '#000',
      white: '#fff'
    },
    primary: {
      light: navType === 'dark' ? colors.blue[700] : '#90caf9', // primaryLight
      main: colors.blue[500], // primaryMain
      dark: navType === 'dark' ? colors.blue[300] : '#1e88e5', // primaryDark
      200: '#90caf9', // primary200
      800: '#1565c0', // primary800
      contrastText: '#fff'
    },
    secondary: {
      light: navType === 'dark' ? '#B39DDB' : '#ede7f6', // secondaryLight
      main: '#7e57c2', // secondaryMain
      dark: navType === 'dark' ? '#673ab7' : '#5e35b1', // secondaryDark
      200: '#b39ddb', // secondary200
      800: '#4527a0', // secondary800
      contrastText: '#fff'
    },
    error: {
        light: colors.red[300],
        main: colors.red[500],
        dark: colors.red[700]
    },
    orange: {
        light: colors.orange[300],
        main: colors.orange[500],
        dark: colors.orange[900]
    },
    warning: {
        light: colors.yellow[300],
        main: colors.yellow[500],
        dark: colors.yellow[700]
    },
    success: {
        light: colors.green[300],
        main: colors.green[500],
        dark: colors.green[700],
        200: colors.green[200]
    },
    grey: colors.grey,
    dark: {
        light: colors.grey[600],
        main: colors.grey[700],
        dark: colors.grey[800],
        800: colors.grey[800],
        900: colors.grey[900]
    },
    text: {
        primary: navType === 'dark' ? '#fff' : colors.grey[900],
        secondary: navType === 'dark' ? colors.grey[400] : colors.grey[600],
    },
    background: {
        paper: navType === 'dark' ? '#1c2128' : '#fff',
        default: navType === 'dark' ? '#0d1117' : colors.grey[50]
    }
  };
};

export default Palette;