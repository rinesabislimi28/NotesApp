import React, { useState, useContext, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { getNotes, getSearchHistory, saveToHistory, removeFromHistory, clearSearchHistory } from '../storage/notesStorage';
import Header from '../components/Header';

export default function HomeScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [notes, setNotes] = useState([]);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    const n = await getNotes();
    const h = await getSearchHistory();
    setNotes(n);
    setHistory(h);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  // Funksioni që ruan kërkimin në histori
  const handleSearch = async () => {
    if (query.trim()) {
      await saveToHistory(query.trim());
      loadData(); // Rifreskon listën e historisë në ekran
    }
  };

  const filtered = notes.filter(n => 
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.content.toLowerCase().includes(query.toLowerCase())
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={{ opacity: headerOpacity, paddingHorizontal: 25 }}>
        <Header title="Notes" />
        
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.subText} />
          <TextInput 
            placeholder="Search notes..." 
            placeholderTextColor={colors.subText}
            style={[styles.input, { color: colors.text }]}
            value={query} 
            onChangeText={setQuery}
            onSubmitEditing={handleSearch} // Kjo e ruan në histori
            returnKeyType="search"
          />
        </View>

        {/* Shfaqja e historisë */}
        <View style={styles.historyWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {history.map((h, i) => (
              <View key={i} style={[styles.historyChip, { backgroundColor: colors.inputBg }]}>
                <TouchableOpacity onPress={() => setQuery(h)}>
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>{h}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => { await removeFromHistory(h); loadData(); }}>
                  <Ionicons name="close-circle" size={16} color={colors.subText} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ))}
            {history.length > 0 && (
              <TouchableOpacity onPress={async () => { await clearSearchHistory(); loadData(); }} style={styles.clearBtn}>
                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 12 }}>Clear All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Animated.View>

      <Animated.FlatList 
        data={filtered} 
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[
              styles.bentoCard, 
              { 
                backgroundColor: colors.card, 
                height: 200, // Lartësi fikse për të gjitha kartat
                marginTop: index % 2 !== 0 ? 20 : 0 
              }
            ]} 
            onPress={() => navigation.navigate('EditNote', { note: item })}
          >
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
              <Text style={[styles.cardSnippet, { color: colors.subText }]} numberOfLines={4}>{item.content}</Text>
            </View>
            <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity 
        style={[styles.premiumFab, { backgroundColor: colors.primary }]} 
        onPress={() => navigation.navigate('CreateNote')}
      >
        <Ionicons name="add" size={35} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 22, borderWidth: 1, marginTop: 15 },
  input: { flex: 1, marginLeft: 10, fontWeight: '600' },
  historyWrapper: { height: 40, marginTop: 10 },
  historyChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, marginRight: 8 },
  clearBtn: { justifyContent: 'center', paddingHorizontal: 10 },
  bentoCard: { 
    width: '48%', 
    borderRadius: 30, 
    padding: 20, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 15 
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', lineHeight: 22, marginBottom: 6 },
  cardSnippet: { fontSize: 12, lineHeight: 18 },
  categoryText: { fontSize: 9, fontWeight: '900', marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  premiumFab: { 
    position: 'absolute', 
    bottom: 40, 
    right: 30, 
    width: 70, 
    height: 70, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 15,
    shadowColor: '#6366F1',
    shadowOpacity: 0.4,
    shadowRadius: 20
  }
});