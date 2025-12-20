import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, ActivityIndicator, Platform, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getNotes,
  deleteNote,
  getSearchHistory,
  saveSearchTerm,
  clearSearchHistory
} from '../storage/notesStorage';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { settings, updateSettings, colors } = useContext(ThemeContext);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { unsub(); clearInterval(timer); };
  }, [navigation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [notesData, historyData] = await Promise.all([
        getNotes(),
        getSearchHistory()
      ]);
      setNotes(notesData || []);
      setSearchHistory(historyData || []);
    } catch (error) {
      console.error("Loading Error:", error);
    }
    setLoading(false);
  };

  const handleSearchSubmit = async (term) => {
    if (!term.trim()) return;
    await saveSearchTerm(term.trim());
    const newHistory = await getSearchHistory();
    setSearchHistory(newHistory);
  };

  const filteredNotes = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  );

  const renderNote = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('EditNote', { note: item })}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title || 'Untitled'}
        </Text>
        <TouchableOpacity
          onPress={async () => { await deleteNote(item.id); loadData(); }}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-bin-outline" size={18} color="red" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.content, { color: colors.subText }]} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{item.category || 'Other'}</Text>
        </View>
        <Text style={[styles.dateText, { color: colors.subText }]}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.timeLabel, { color: colors.primary }]}>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notes</Text>
          </View>
          <TouchableOpacity
            onPress={() => updateSettings({ ...settings, darkMode: !settings.darkMode })}
            style={[styles.iconButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name={settings.darkMode ? "sunny" : "moon"} size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Ionicons name="search-outline" size={20} color={colors.subText} />
          <TextInput
            placeholder="Search on all devices..."
            placeholderTextColor={colors.subText}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={(e) => handleSearchSubmit(e.nativeEvent.text)}
          />
        </View>

        {/* HISTORY CHIPS */}
        {searchHistory.length > 0 && !search && (
          <View style={{ height: 50, marginBottom: 15 }}>
            <FlatList
              horizontal
              data={searchHistory}
              keyExtractor={(item, idx) => `hist-${idx}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setSearch(item)}
                >
                  <Ionicons name="cloud-done-outline" size={14} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontSize: 13 }}>{item}</Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <TouchableOpacity style={styles.clearChip} onPress={async () => { await clearSearchHistory(); setSearchHistory([]); }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>CLEAR</Text>
                </TouchableOpacity>
              }
            />
          </View>
        )}

        {/* MAIN LIST */}
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={filteredNotes}
              keyExtractor={item => item.id}
              renderItem={renderNote}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{ color: colors.subText }}>No notes found.</Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      {/* BUTONI PLUS (FAB)*/}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('CreateNote')}
      >
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingTop: 10, marginBottom: 10, alignItems: 'center' },
  timeLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  headerTitle: { fontSize: 34, fontWeight: '900' },
  iconButton: { width: 46, height: 46, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 20, height: 55, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  chip: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, marginRight: 10, borderWidth: 1, alignItems: 'center', height: 40 },
  clearChip: { justifyContent: 'center', paddingHorizontal: 15, height: 40 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  card: { padding: 20, marginBottom: 16, borderRadius: 24, elevation: 4, shadowOpacity: 0.1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 19, fontWeight: '700', flex: 1 },
  content: { fontSize: 15, lineHeight: 22 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  dateText: { fontSize: 12 },
  deleteBtn: { padding: 5 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    ...Platform.select({
      web: {
        position: 'fixed',
      }
    })
  },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 50 }
});