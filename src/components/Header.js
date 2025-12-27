import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title }) {
  const { settings, updateSettings, colors } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity 
        style={[styles.toggleBtn, { backgroundColor: colors.inputBg }]} 
        onPress={() => updateSettings({ ...settings, darkMode: !settings.darkMode })}
      >
        <Ionicons name={settings.darkMode ? "sunny" : "moon"} size={18} color={settings.darkMode ? "#FFD60A" : colors.primary} />
        <Text style={[styles.toggleText, { color: colors.text }]}>{settings.darkMode ? "Light" : "Dark"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  title: { fontSize: 32, fontWeight: '800' },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  toggleText: { marginLeft: 6, fontSize: 13, fontWeight: '600' }
});