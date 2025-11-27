import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeStyles } from '../theme/styles';
import { getSearchHistory, addToSearchHistory, clearSearchHistory, removeFromSearchHistory } from '../storage/notesStorage';
import { vibrate } from '../utils/haptics';

const SearchBar = ({ value, onChange, isDark, onSearchSubmit }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isFocused) {
            loadHistory();
        }
    }, [isFocused]);

    const loadHistory = async () => {
        const data = await getSearchHistory();
        setHistory(data);
    };

    const handleClearHistory = async () => {
        vibrate('medium');
        await clearSearchHistory();
        setHistory([]);
    };

    const handleDeleteItem = async (item) => {
        vibrate('warning');
        await removeFromSearchHistory(item);
        loadHistory();
    };

    const handleHistorySelect = (item) => {
        vibrate('selection');
        onChange(item);
        setIsFocused(false);
        Keyboard.dismiss();
        onSearchSubmit && onSearchSubmit(item);
    };

    const handleSubmit = () => {
        if (value.trim()) {
            addToSearchHistory(value);
            onSearchSubmit && onSearchSubmit(value);
        }
        setIsFocused(false);
    };

    return (
        <View style={{ zIndex: 10 }}>
            <View style={[styles.container, themeStyles.card(isDark)]}>
                <Ionicons name="search" size={20} color={isDark ? '#9ca3af' : '#6b7280'} style={styles.icon} />
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onSubmitEditing={handleSubmit}
                    placeholder="Search notes..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    style={[styles.input, themeStyles.text(isDark)]}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChange('')}>
                        <Ionicons name="close-circle" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                    </TouchableOpacity>
                )}
            </View>

            {isFocused && history.length > 0 && (
                <View style={[styles.historyDropdown, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }]}>
                    <View style={styles.historyHeader}>
                        <Text style={[styles.historyTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>Recent Searches</Text>
                        <TouchableOpacity onPress={handleClearHistory}>
                            <Text style={styles.clearText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                    {history.map((item, index) => (
                        <View key={index} style={styles.historyItemContainer}>
                            <TouchableOpacity style={styles.historyItem} onPress={() => handleHistorySelect(item)}>
                                <Ionicons name="time-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} style={{ marginRight: 8 }} />
                                <Text style={{ color: isDark ? '#e2e8f0' : '#334155', flex: 1 }}>{item}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteItem(item)} style={styles.deleteItemBtn}>
                                <Ionicons name="close" size={16} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, marginBottom: 10 },
    icon: { marginRight: 8 },
    input: { flex: 1, fontSize: 16, height: '100%' },
    historyDropdown: {
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        borderRadius: 12,
        borderWidth: 1,
        padding: 8,
        elevation: 5,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 },
    historyTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    clearText: { fontSize: 12, color: '#ef4444' },
    historyItemContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#33415520' },
    historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4, flex: 1 },
    deleteItemBtn: { padding: 8 },
});

export default SearchBar;