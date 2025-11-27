import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeStyles } from '../theme/styles';

const NoteItem = ({ note, onEdit, onDelete, isDark }) => {
    // Format date logic
    const displayDate = note.targetDate
        ? new Date(note.targetDate).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : new Date(note.dateCreated).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const isTargetDate = !!note.targetDate;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                themeStyles.card(isDark),
                isDark ? styles.cardDark : styles.cardLight
            ]}
            onPress={onEdit}
            activeOpacity={0.7}
        >
            <View style={styles.contentWrapper}>
                <View style={styles.header}>
                    <Text style={[styles.title, themeStyles.text(isDark)]} numberOfLines={1}>
                        {note.title || 'Untitled Note'}
                    </Text>
                    {isTargetDate && (
                        <View style={styles.dateBadge}>
                            <Ionicons name="calendar" size={12} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.dateBadgeText}>
                                {new Date(note.targetDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.content, themeStyles.textSecondary(isDark)]} numberOfLines={3}>
                    {note.content || 'No additional text'}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.tagsContainer}>
                        {note.tags && note.tags.slice(0, 3).map((tag, i) => (
                            <View key={i} style={[styles.tagBadge, isDark ? styles.tagBadgeDark : styles.tagBadgeLight]}>
                                <Text style={[styles.tagText, isDark ? styles.tagTextDark : styles.tagTextLight]}>#{tag}</Text>
                            </View>
                        ))}
                        {note.tags && note.tags.length > 3 && (
                            <Text style={[styles.moreTags, themeStyles.textSecondary(isDark)]}>+{note.tags.length - 3}</Text>
                        )}
                    </View>

                    <Text style={[styles.dateText, themeStyles.textSecondary(isDark)]}>{displayDate}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} style={[styles.actionBtn, styles.editBtn]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="create-outline" size={18} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, styles.deleteBtn]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardLight: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardDark: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
    },
    contentWrapper: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
        letterSpacing: -0.5,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 4,
    },
    dateBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    tagBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
        marginBottom: 4,
    },
    tagBadgeLight: { backgroundColor: '#f1f5f9' },
    tagBadgeDark: { backgroundColor: '#334155' },
    tagText: { fontSize: 12, fontWeight: '500' },
    tagTextLight: { color: '#475569' },
    tagTextDark: { color: '#cbd5e1' },
    moreTags: { fontSize: 12 },
    dateText: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    actions: {
        justifyContent: 'center',
        paddingRight: 12,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        gap: 12,
    },
    actionBtn: {
        padding: 8,
        borderRadius: 8,
    },
    editBtn: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    deleteBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
});

export default NoteItem;