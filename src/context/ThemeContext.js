import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const themeColors = {
  light: { background: '#F2F2F7', card: '#FFFFFF', text: '#1C1C1E', subText: '#8E8E93', primary: '#007AFF', danger: '#FF3B30', inputBg: '#E5E5EA', border: '#C6C6C8' },
  dark: { background: '#000000', card: '#1C1C1E', text: '#FFFFFF', subText: '#98989D', primary: '#0A84FF', danger: '#FF453A', inputBg: '#2C2C2E', border: '#38383A' }
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({ darkMode: false, searchHistory: [] });

  useEffect(() => {
    AsyncStorage.getItem('SETTINGS').then(res => { if (res) setSettings(JSON.parse(res)) });
  }, []);

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('SETTINGS', JSON.stringify(newSettings));
  };

  const colors = settings.darkMode ? themeColors.dark : themeColors.light;

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};