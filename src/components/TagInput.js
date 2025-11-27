import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeStyles } from '../theme/styles';
import { vibrate } from '../utils/haptics';

const TagInput = ({ tags, setTags, isDark }) => {
    const [input, setInput] = useState('');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const addTag = () => {
        if (input.trim() && !tags.includes(input.trim())) {
            vibrate('light');
            setTags([...tags, input.trim()]);
            setInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        vibrate('light');
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const toggleDay = (day) => {
        vibrate('selection');
        if (tags.includes(day)) {
            setTags(tags.filter(t => t !== day));
        } else {
            setTags([...tags, day]);
        }
    };

    // Creative colors for tags
    const tagColors = [
        { bg: '#fee2e2', text: '#ef4444' }, // Red
        { bg: '#ffedd5', text: '#f97316' }, // Orange
        { bg: '#fef9c3', text: '#eab308' }, // Yellow
        { bg: '#dcfce7', text: '#22c55e' }, // Green
        { bg: '#dbeafe', text: '#3b82f6' }, // Blue
        { bg: '#e0e7ff', text: '#6366f1' }, // Indigo
        { bg: '#f3e8ff', text: '#a855f7' }, // Purple
        { bg: '#fce7f3', text: '#ec4899' }, // Pink
    ];

    const getTagColor = (index) => {
        return tagColors[index % tagColors.length];
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, themeStyles.textSecondary(isDark)]}>Days (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
                {days.map((day) => {
                    const isSelected = tags.includes(day);
                    return (
                        <TouchableOpacity
                            key={day}
                            onPress={() => toggleDay(day)}
                            style={[
                                styles.dayChip,
                                isSelected ? { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' } : (isDark ? { backgroundColor: '#1e293b', borderColor: '#334155' } : { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' })
                            ]}
                        >
                            <Text style={[
                                styles.dayText,
                                isSelected ? { color: '#fff' } : (isDark ? { color: '#94a3b8' } : { color: '#64748b' })
                            ]}>{day}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={[styles.inputContainer, themeStyles.textInput(isDark)]}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Add custom tag..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    style={[styles.input, themeStyles.text(isDark)]}
                    onSubmitEditing={addTag}
                    returnKeyType="done"
                    blurOnSubmit={false}
                />
                <TouchableOpacity onPress={addTag} style={styles.addBtn}>
                    <Ionicons name="add-circle" size={28} color="#0ea5e9" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsList}>
                {tags.filter(t => !days.includes(t)).map((tag, index) => {
                    const color = getTagColor(index);
                    return (
                        <View key={index} style={[
                            styles.tag,
                            isDark ? { backgroundColor: '#334155' } : { backgroundColor: color.bg }
                        ]}>
                            <Text style={[
                                styles.tagText,
                                isDark ? { color: '#e2e8f0' } : { color: color.text }
                            ]}>#{tag}</Text>
                            <TouchableOpacity onPress={() => removeTag(tag)}>
                                <Ionicons name="close-circle" size={16} color={isDark ? '#94a3b8' : color.text} style={{ opacity: 0.7 }} />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    daysContainer: { flexDirection: 'row', marginBottom: 12 },
    dayChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: { fontSize: 13, fontWeight: '600' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: 'transparent'
    },
    input: { flex: 1, height: '100%', fontSize: 16, borderWidth: 0 },
    addBtn: { marginLeft: 8 },
    tagsList: { flexDirection: 'row', marginTop: 12 },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    tagText: { fontSize: 14, fontWeight: '600', marginRight: 6 },
});

export default TagInput;
