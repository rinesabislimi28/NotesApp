import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TagFilter = ({ tags, selectedTag, onSelectTag, isDark }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TouchableOpacity
                style={[
                    styles.chip,
                    !selectedTag ? styles.chipSelected : (isDark ? styles.chipDark : styles.chipLight)
                ]}
                onPress={() => onSelectTag(null)}
            >
                <Text style={[
                    styles.text,
                    !selectedTag ? styles.textSelected : (isDark ? styles.textDark : styles.textLight)
                ]}>All</Text>
            </TouchableOpacity>

            {tags.map((tag, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.chip,
                        selectedTag === tag ? styles.chipSelected : (isDark ? styles.chipDark : styles.chipLight)
                    ]}
                    onPress={() => onSelectTag(tag === selectedTag ? null : tag)}
                >
                    <Text style={[
                        styles.text,
                        selectedTag === tag ? styles.textSelected : (isDark ? styles.textDark : styles.textLight)
                    ]}>#{tag}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        flexGrow: 0,
        maxHeight: 50,
    },
    contentContainer: {
        alignItems: 'center',
        paddingRight: 16,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        alignSelf: 'center',
    },
    chipLight: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
    chipDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
    chipSelected: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
    text: { fontSize: 13, fontWeight: '600' },
    textLight: { color: '#475569' },
    textDark: { color: '#cbd5e1' },
    textSelected: { color: '#ffffff' },
});

export default TagFilter;
