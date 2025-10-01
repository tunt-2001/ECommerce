import { createTheme } from '@mui/material/styles';
import themePalette from './palette';
import themeTypography from './typography';

const theme = (customization) => {
    // Lấy đối tượng palette bằng cách gọi hàm đã được đơn giản hóa
    const palette = themePalette(customization.navType); // Chỉ cần navType (light/dark)

    // Lấy đối tượng typography
    const typography = themeTypography(customization.fontFamily, customization.borderRadius);

    const themeOptions = {
        direction: 'ltr',
        palette: palette,
        typography: typography,
    };

    const themes = createTheme(themeOptions);
    // themes.components = componentStyleOverrides(themes); // Tạm thời bỏ qua

    return themes;
};

export default theme;