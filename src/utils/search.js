export const searchNotes = (notes, keyword) => {
    if (!keyword || !keyword.trim()) return notes;
    const k = keyword.toLowerCase();
    return notes.filter(n => {
        const inTitle = (n.title || '').toLowerCase().includes(k);
        const inContent = (n.content || '').toLowerCase().includes(k);
        const inTags = (n.tags || []).some(t => t.toLowerCase().includes(k));
        return inTitle || inContent || inTags;
    });
};