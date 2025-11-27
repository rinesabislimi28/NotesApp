import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'NOTES_V1';
const SEARCH_HISTORY_KEY = 'SEARCH_HISTORY_V1';

// Create a new note object
export const createNote = (title, content, tags = [], targetDate = null) => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  title: title?.trim() || '',
  content: content?.trim() || '',
  tags: tags || [],
  targetDate: targetDate,
  dateCreated: new Date().toISOString(),
  dateModified: null,
});

// Retrieve all notes
export const getNotes = async () => {
  try {
    const json = await AsyncStorage.getItem(NOTES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed reading notes', e);
    return [];
  }
};

// Save notes array
export const saveNotes = async (notes) => {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed saving notes', e);
  }
};

export const addNote = async (note) => {
  const notes = await getNotes();
  const newNotes = [note, ...notes];
  await saveNotes(newNotes);
};

export const updateNote = async (updated) => {
  const notes = await getNotes();
  const newNotes = notes.map(n => (n.id === updated.id ? updated : n));
  await saveNotes(newNotes);
};

export const deleteNote = async (id) => {
  const notes = await getNotes();
  const newNotes = notes.filter(n => n.id !== id);
  await saveNotes(newNotes);
};

export const clearAll = async () => {
  await AsyncStorage.removeItem(NOTES_KEY);
  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
};

// Search history functions
export const getSearchHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed reading search history', e);
    return [];
  }
};

export const addToSearchHistory = async (query) => {
  if (!query || !query.trim()) return;
  const history = await getSearchHistory();
  const trimmed = query.trim();
  const newHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 10);
  try {
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Failed saving search history', e);
  }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error('Failed clearing search history', e);
  }
};

export const removeFromSearchHistory = async (itemToRemove) => {
  const history = await getSearchHistory();
  const newHistory = history.filter(item => item !== itemToRemove);
  try {
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Failed removing from search history', e);
  }
};