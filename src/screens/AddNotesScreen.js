import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addNote, createNote } from '../storage/notesStorage';
import { themeStyles } from '../theme/styles';
import { AppContext } from '../context/AppContext';
import TagInput from '../components/TagInput';
import { Ionicons } from '@expo/vector-icons';
import { vibrate } from '../utils/haptics';

const AddNoteScreen = ({ navigation }) => {
  const { isDark } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);

  // Automatic date/time
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update time every minute to keep it fresh
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      vibrate('error');
      Alert.alert('Empty Note', 'Please enter a title or content.');
      return;
    }

    try {
      // Use current date as targetDate since it's automatic now
      const newNote = createNote(title, content, tags, currentDate.toISOString());
      await addNote(newNote);
      vibrate('success');
      Keyboard.dismiss();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note:', error);
      vibrate('error');
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container(isDark)]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#e2e8f0' : '#334155'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text(isDark)]}>New Note</Text>
        <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
          <Ionicons name="checkmark" size={24} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.dateDisplay}>
          <Ionicons name="time-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} style={{ marginRight: 6 }} />
          <Text style={[styles.dateText, themeStyles.textSecondary(isDark)]}>
            {currentDate.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        <TextInput
          placeholder="Title"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          style={[styles.titleInput, themeStyles.text(isDark)]}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <TagInput tags={tags} setTags={setTags} isDark={isDark} />

        <TextInput
          placeholder="Start typing..."
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          style={[styles.contentInput, themeStyles.text(isDark)]}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  iconBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  contentContainer: { flex: 1, padding: 20 },
  dateDisplay: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, opacity: 0.7 },
  dateText: { fontSize: 14, fontWeight: '500' },
  titleInput: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  contentInput: { flex: 1, fontSize: 16, lineHeight: 24, minHeight: 200 },
});

export default AddNoteScreen;
