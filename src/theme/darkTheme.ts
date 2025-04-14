import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#ffffff' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#ffffff', secondary: '#ffffff' },
    error: { main: '#f44336' },
    info: { main: '#2196f3' },
  },
});

export default darkTheme;
