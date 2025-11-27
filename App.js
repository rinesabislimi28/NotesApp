import React, { useEffect, useState } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddNoteScreen from './src/screens/AddNotesScreen';
import EditNoteScreen from './src/screens/EditNotesScreen';

import { ThemeProvider } from './src/theme/ThemeProvider';
import { AppContext } from './src/context/AppContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  const deviceScheme = useColorScheme(); // Detect system theme
  const [isDark, setIsDark] = useState(deviceScheme === 'dark');

  useEffect(() => {
    setIsDark(deviceScheme === 'dark');
  }, [deviceScheme]);

  return (
    <SafeAreaProvider>
      <AppContext.Provider value={{ isDark, setIsDark }}>
        <ThemeProvider isDark={isDark}>
          <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
            {/* Set status bar style based on theme */}
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddNote" component={AddNoteScreen} />
              <Stack.Screen name="EditNote" component={EditNoteScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
