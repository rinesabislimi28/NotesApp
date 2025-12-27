import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { saveNote } from '../storage/notesStorage';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNoteScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [form, setForm] = useState({ title: '', content: '', category: 'Personal' });
  const cats = ['Personal', 'Work', 'Finance', 'Ideas', 'Health'];

  const onSave = async () => {
    if (!form.title.trim()) return;
    await saveNote({ ...form, date: new Date().toLocaleDateString() });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={32} color={colors.text} /></TouchableOpacity>
        <TouchableOpacity onPress={onSave} style={[styles.btn, { backgroundColor: colors.primary }]}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Save</Text></TouchableOpacity>
      </View>
      <ScrollView style={{ padding: 25 }}>
        <TextInput placeholder="Title" placeholderTextColor={colors.subText} style={[styles.tInput, { color: colors.text }]} onChangeText={t => setForm({...form, title: t})} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {cats.map(c => (
            <TouchableOpacity key={c} onPress={() => setForm({...form, category: c})} style={[styles.chip, { backgroundColor: form.category === c ? colors.primary : colors.card }]}>
              <Text style={{ color: form.category === c ? '#FFF' : colors.text }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput placeholder="Content..." multiline placeholderTextColor={colors.subText} style={[styles.cInput, { color: colors.text }]} onChangeText={t => setForm({...form, content: t})} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  btn: { padding: 10, paddingHorizontal: 25, borderRadius: 15 },
  tInput: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  chip: { padding: 10, paddingHorizontal: 15, borderRadius: 12, marginRight: 10 },
  cInput: { fontSize: 18, minHeight: 400, textAlignVertical: 'top' }
});