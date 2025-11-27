import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Keyboard, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateNote } from '../storage/notesStorage';
import { themeStyles } from '../theme/styles';
import { AppContext } from '../context/AppContext';
import TagInput from '../components/TagInput';
import { Ionicons } from '@expo/vector-icons';
import { vibrate } from '../utils/haptics';

const EditNotesScreen = ({ route, navigation }) => {
  const { isDark } = useContext(AppContext);
  const { note } = route.params;

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags || []);
  const [targetDate, setTargetDate] = useState(note.targetDate ? new Date(note.targetDate) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveChanges = async () => {
    if (!title.trim() && !content.trim()) {
      vibrate('error');
      Alert.alert('Empty note', 'Please add a title or content');
      return;
    }

    const updatedNote = {
      ...note,
      title,
      content,
      tags,
      targetDate: targetDate ? targetDate.toISOString() : null,
      dateModified: new Date().toISOString()
    };
    await updateNote(updatedNote);
    vibrate('success');

    Keyboard.dismiss();
    navigation.goBack();
  };

  const handleBack = () => {
    vibrate('light');
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      vibrate('selection');
      setTargetDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container(isDark)]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#e2e8f0' : '#334155'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text(isDark)]}>Edit Note</Text>
        <TouchableOpacity onPress={saveChanges} style={styles.iconBtn}>
          <Ionicons name="checkmark" size={24} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <TextInput
          placeholder="Title"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          style={[styles.titleInput, themeStyles.text(isDark)]}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[styles.dateBtn, isDark ? styles.dateBtnDark : styles.dateBtnLight]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={isDark ? '#94a3b8' : '#475569'} />
            <Text style={[styles.dateText, themeStyles.textSecondary(isDark)]}>
              {targetDate ? targetDate.toLocaleDateString() : 'Add Date (Optional)'}
            </Text>
            {targetDate && (
              <TouchableOpacity onPress={() => setTargetDate(null)} style={{ marginLeft: 'auto' }}>
                <Ionicons name="close-circle" size={18} color={isDark ? '#94a3b8' : '#475569'} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={targetDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <TagInput tags={tags} setTags={setTags} isDark={isDark} />

        <TextInput
          placeholder="Edit your note..."
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
  titleInput: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  contentInput: { flex: 1, fontSize: 16, lineHeight: 24, minHeight: 200 },
  dateContainer: { marginBottom: 16 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1 },
  dateBtnLight: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  dateBtnDark: { borderColor: '#334155', backgroundColor: '#1e293b' },
  dateText: { marginLeft: 8, fontSize: 14 },
});

export default EditNotesScreen;
