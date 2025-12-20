import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveNote } from '../storage/notesStorage';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNoteScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Plotësoni të gjitha fushat!");
      return;
    }

    setLoading(true);
    const finalCategory = isCustom ? (customCategory || 'Other') : category;

    const newNote = {
      title: title.trim(),
      content: content.trim(),
      category: finalCategory,
      date: new Date().toLocaleDateString('en-GB'),
    };

    const success = await saveNote(newNote);
    if (success) {
      navigation.goBack();
    } else {
      alert("Gabim! Kontrollo lidhjen me internet.");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>New Note</Text>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>{loading ? "..." : "Save"}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <TextInput
            placeholder="Title"
            placeholderTextColor={colors.subText}
            style={[styles.titleInput, { color: colors.text }]}
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.catRow}>
            {['Personal', 'Work', 'Ideas', 'Other'].map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => { setCategory(cat); setIsCustom(cat === 'Other'); }}
                style={[styles.chip, { backgroundColor: category === cat ? colors.primary : colors.card }]}
              >
                <Text style={{ color: category === cat ? '#fff' : colors.text }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            placeholder="Write content..."
            placeholderTextColor={colors.subText}
            style={[styles.contentInput, { color: colors.text }]}
            multiline
            value={content}
            onChangeText={setContent}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10
  },
  contentInput: {
    fontSize: 18,
    minHeight: 300,
    textAlignVertical: 'top'
  }
});