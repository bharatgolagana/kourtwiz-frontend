// context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import lightTheme from '../theme/lightTheme';
import darkTheme from '../theme/darkTheme';
import AuthContext from './AuthContext';

const ThemeModeContext = createContext(null);

// Storage helpers
const getStorageItem = (key, fallback = {}) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const ThemeContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext)!;
  const [mode, setMode] = useState('light');
  const [customThemes, setCustomThemes] = useState([]);
  console.log('user : ', user);
  // Load theme mode and custom themes for the current user
  useEffect(() => {
    console.log('before user id :', user?.userId);

    if (!user?.userId || !user) return;
    console.log('after user id :', user?.userId);
    const modesByUser = getStorageItem('themeModeByUser');
    const themesByUser = getStorageItem('customThemesByUser');
    console.log('during load: ');
    console.log('mode by user : ', modesByUser);
    console.log('theme by user : ', themesByUser);
    setMode(modesByUser[user.userId] || 'light');
    setCustomThemes(themesByUser[user.userId] || []);
  }, [user?.userId]);

  // Save theme mode when it changes
  useEffect(() => {
    if (!user?.userId) return;
    console.log('saving theme : ');
    const modesByUser = getStorageItem('themeModeByUser');
    modesByUser[user.userId] = mode;
    console.log('mdoes by user : ', modesByUser);
    setStorageItem('themeModeByUser', modesByUser);
  }, [mode, user?.userId]);

  // Save custom themes when they change
  useEffect(() => {
    console.log('saving custom theme!');
    if (!user?.userId) return;

    const themesByUser = getStorageItem('customThemesByUser');
    themesByUser[user.userId] = customThemes;
    setStorageItem('customThemesByUser', themesByUser);
    console.log('on save : custom theme : ', themesByUser);
  }, [customThemes, user?.userId]);

  const currentTheme = useMemo(() => {
    if (mode === 'light') return createTheme(lightTheme);
    if (mode === 'dark') return createTheme(darkTheme);

    const custom = customThemes.find((t) => t.name === mode);
    return custom ? createTheme(custom.theme) : createTheme(lightTheme);
  }, [mode, customThemes]);

  const addCustomTheme = (name, theme) => {
    console.log('addCustomTheme : ', name, theme);
    setCustomThemes((prev) => [...prev, { name, theme }]);
    setMode(name);
  };

  return (
    <ThemeModeContext.Provider
      value={{ mode, setTheme: setMode, addCustomTheme, customThemes }}
    >
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeContext;

export const useThemeMode = () => useContext(ThemeModeContext);
