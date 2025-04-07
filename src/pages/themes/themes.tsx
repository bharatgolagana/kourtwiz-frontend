import { Typography } from '@mui/material';
import ThemeProfileSettings from '../../features/themes/components/ThemeProfileSettings';

const ThemesSettings = () => {
  return (
    <>
      <Typography variant='h3' color='text.secondary'>
        Themes Settings
      </Typography>
      <ThemeProfileSettings />
    </>
  );
};

export default ThemesSettings;
