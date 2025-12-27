import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const themeColors = {
  light: { 
    background: '#F0F2F8', 
    card: '#FFFFFF', 
    text: '#0F172A', 
    subText: '#64748B', 
    primary: '#6366F1', // Indigo
    danger: '#F43F5E', 
    inputBg: '#FFFFFF', 
    border: '#E2E8F0',
    glass: 'rgba(255, 255, 255, 0.7)',
    shadow: '#6366F1'
  },
  dark: { 
    background: '#020617', 
    card: '#1E293B', 
    text: '#F8FAFC', 
    subText: '#94A3B8', 
    primary: '#818CF8', 
    danger: '#FB7185', 
    inputBg: '#0F172A', 
    border: '#334155',
    glass: 'rgba(30, 41, 59, 0.7)',
    shadow: '#000000'
  }
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({ darkMode: false });

  useEffect(() => {
    AsyncStorage.getItem('SETTINGS').then(res => {
      if (res) setSettings(JSON.parse(res));
    });
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