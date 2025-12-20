import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { updateNote } from '../storage/notesStorage';
import { ThemeContext } from '../context/ThemeContext';

export default function EditNoteScreen({ route, navigation }) {
  const { note } = route.params;
  const { colors } = useContext(ThemeContext);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [otherCategory, setOtherCategory] = useState('');

  const saveNote = async () => {
    const finalCategory = category === 'Other' && otherCategory ? otherCategory : category;
    await updateNote({ ...note, title, content, category: finalCategory });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Text style={{ color: colors.primary, fontSize: 17 }}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Edit Note</Text>
        <TouchableOpacity onPress={saveNote} style={styles.navBtn}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 17 }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={colors.subText}
        />

        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['General', 'Work', 'Study', 'Other'].map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  { backgroundColor: category === cat ? colors.primary : colors.inputBg }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={{ color: category === cat ? '#fff' : colors.text }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {category === 'Other' && (
          <TextInput
            style={[styles.otherInput, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={otherCategory}
            onChangeText={setOtherCategory}
            placeholder="Category name"
            placeholderTextColor={colors.subText}
          />
        )}

        <TextInput
          style={[styles.contentInput, { color: colors.text }]}
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          placeholder="Note content"
          placeholderTextColor={colors.subText}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navBtn: { 
    padding: 4 
  },
  navTitle: { 
    fontSize: 17, 
    fontWeight: '600' 
  },
  titleInput: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 20, 
    marginBottom: 15 
  },
  categoryContainer: { 
    marginBottom: 20 
  },
  categoryChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginRight: 10 
  },
  otherInput: { 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 20, 
    fontSize: 16 
  },
  contentInput: { 
    fontSize: 18, 
    lineHeight: 28, 
    minHeight: 300, 
    paddingBottom: 40 
  },
});