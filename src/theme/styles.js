export const themeStyles = {
    container: (isDark) => ({ backgroundColor: isDark ? '#0f172a' : '#f8fafc', flex: 1 }),
    text: (isDark) => ({ color: isDark ? '#f1f5f9' : '#1e293b' }),
    textSecondary: (isDark) => ({ color: isDark ? '#94a3b8' : '#64748b' }),
    card: (isDark) => ({
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        boxShadow: isDark ? '0px 4px 8px rgba(0, 0, 0, 0.3)' : '0px 4px 8px rgba(100, 116, 139, 0.08)',
        elevation: 4,
        borderRadius: 16,
    }),
    textInput: (isDark) => ({
        color: isDark ? '#f1f5f9' : '#1e293b',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
    }),
};
