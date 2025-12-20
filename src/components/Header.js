import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function Header({ title }) {
  const { settings, updateSettings } = useContext(ThemeContext);

  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, { color: settings.darkMode ? '#fff' : '#000' }]}>{title}</Text>
      <Switch
        value={settings.darkMode}
        onValueChange={() =>
          updateSettings({ ...settings, darkMode: !settings.darkMode })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: { fontSize: 26, fontWeight: 'bold' },
});
