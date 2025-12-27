import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { updateNote, deleteNote } from '../storage/notesStorage';

export default function EditNoteScreen({ route, navigation }) {
  const { note } = route.params;
  const { colors } = useContext(ThemeContext);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity onPress={async () => { await deleteNote(note.id); navigation.goBack(); }}>
            <Ionicons name="trash-outline" size={24} color={colors.danger} style={{ marginRight: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.doneBtn, { backgroundColor: colors.text }]} 
            onPress={async () => { await updateNote({...note, title, content}); navigation.goBack(); }}
          >
            <Text style={{ color: colors.background, fontWeight: '800' }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.canvas} showsVerticalScrollIndicator={false}>
        <TextInput
          style={[styles.heroTitle, { color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Note Title"
          placeholderTextColor={colors.subText}
          multiline
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <TextInput
          style={[styles.bodyText, { color: colors.text }]}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor={colors.subText}
          multiline
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, alignItems: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  doneBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15 },
  canvas: { paddingHorizontal: 30, paddingTop: 20 },
  heroTitle: { fontSize: 42, fontWeight: '900', letterSpacing: -1.5 },
  divider: { height: 2, width: 40, marginVertical: 30, borderRadius: 1 },
  bodyText: { fontSize: 20, lineHeight: 32, fontWeight: '400' }
});