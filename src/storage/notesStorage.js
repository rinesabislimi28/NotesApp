import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'NOTES_DATA';
const SEARCH_HISTORY_KEY = 'SEARCH_HISTORY';

/** * NOTES LOGIC 
 */
export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) { return []; }
};

export const saveNote = async (newNote) => {
  try {
    const existing = await getNotes();
    const updated = [{ id: Date.now().toString(), ...newNote }, ...existing];
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return true;
  } catch (e) { return false; }
};

export const updateNote = async (updatedNote) => {
  try {
    const existing = await getNotes();
    const updatedList = existing.map(n => 
      String(n.id) === String(updatedNote.id) ? updatedNote : n
    );
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedList));
    return true;
  } catch (e) { return false; }
};

export const deleteNote = async (id) => {
  try {
    const existingNotes = await getNotes();
    const filtered = existingNotes.filter(n => String(n.id) !== String(id));
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) { return false; }
};

/** * SEARCH HISTORY LOGIC 
 */
export const getSearchHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) { return []; }
};

export const saveToHistory = async (term) => {
  if (!term || !term.trim()) return;
  let history = await getSearchHistory();
  const filtered = history.filter(t => t.toLowerCase() !== term.trim().toLowerCase());
  const updated = [term.trim(), ...filtered].slice(0, 10); 
  await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
};

export const removeFromHistory = async (term) => {
  try {
    let history = await getSearchHistory();
    const updated = history.filter(t => t !== term);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) { console.error(e); }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) { console.error(e); }
};