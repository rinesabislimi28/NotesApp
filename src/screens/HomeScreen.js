import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNotes, deleteNote } from '../storage/notesStorage';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import { searchNotes } from '../utils/search';
import { themeStyles } from '../theme/styles';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { vibrate } from '../utils/haptics';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { isDark, setIsDark } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });
    loadNotes();
    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    const data = await getNotes();
    data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    setNotes(data);
  };

  const handleDelete = async (id) => {
    vibrate('warning');
    await deleteNote(id);
    loadNotes();
  };

  const handleThemeToggle = () => {
    vibrate('light');
    setIsDark(!isDark);
  };

  const handleAddPress = () => {
    vibrate('medium');
    navigation.navigate('AddNote');
  };

  const handleTagSelect = (tag) => {
    vibrate('selection');
    setSelectedTag(tag);
  };

  // Extract all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))].sort();

  // Filter notes by search query AND selected tag
  let filtered = searchNotes(notes, query);
  if (selectedTag) {
    filtered = filtered.filter(note => note.tags && note.tags.includes(selectedTag));
  }

  return (
    <SafeAreaView style={[styles.container, themeStyles.container(isDark)]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, themeStyles.text(isDark)]}>My Notes</Text>

          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={[styles.iconBtn, { marginRight: 8 }]}>
              <Ionicons name={showFilters ? "filter" : "filter-outline"} size={24} color={isDark ? '#e2e8f0' : '#334155'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleThemeToggle} style={styles.iconBtn}>
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={24}
                color={isDark ? '#ffd166' : '#374151'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar
          value={query}
          onChange={setQuery}
          isDark={isDark}
          onSearchSubmit={(q) => setQuery(q)}
        />

        {showFilters && (
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onSelectTag={handleTagSelect}
            isDark={isDark}
          />
        )}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={64} color={isDark ? '#334155' : '#cbd5e1'} />
            <Text style={[styles.emptyText, themeStyles.textSecondary(isDark)]}>
              {query || selectedTag ? 'No matching notes found.' : 'No notes yet.'}
            </Text>
            {!query && !selectedTag && (
              <Text style={[styles.emptySubText, themeStyles.textSecondary(isDark)]}>
                Tap the + button to create your first note.
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <NoteItem
                note={item}
                onEdit={() => {
                  vibrate('selection');
                  navigation.navigate('EditNote', { note: item });
                }}
                onDelete={() => handleDelete(item.id)}
                isDark={isDark}
              />
            )}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleAddPress}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: 'transparent' },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { marginTop: 16, fontSize: 18, fontWeight: '600' },
  emptySubText: { marginTop: 8, fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#0ea5e9',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    boxShadow: '0px 4px 8px rgba(14, 165, 233, 0.3)',
  },
});

export default HomeScreen;
