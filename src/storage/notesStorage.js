import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const notesCollection = collection(db, 'notes');
const historyCollection = collection(db, 'searchHistory');

// 1. Get Notes
export const getNotes = async () => {
  try {
    const q = query(notesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

// 2. CHANGE: Name changed to saveNote (from addNote)
export const saveNote = async (note) => {
  try {
    await addDoc(notesCollection, {
      title: note.title,
      content: note.content,
      category: note.category,
      date: note.date,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error adding note:", error);
    return false;
  }
};

// 3. Update Note
export const updateNote = async (updatedNote) => {
  try {
    const noteRef = doc(db, 'notes', updatedNote.id);
    const { id, ...dataWithoutId } = updatedNote;
    await updateDoc(noteRef, {
      ...dataWithoutId,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating note:", error);
    return false;
  }
};

// 4. Delete Note
export const deleteNote = async (id) => {
  try {
    await deleteDoc(doc(db, 'notes', id));
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

// 5. Get Search History
export const getSearchHistory = async () => {
  try {
    const q = query(historyCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().term);
  } catch (error) {
    return [];
  }
};

// 6. Save Search Term
export const saveSearchTerm = async (term) => {
  try {
    if (!term) return;
    await addDoc(historyCollection, {
      term: term,
      createdAt: serverTimestamp()
    });
  } catch (error) { }
};

// 7. Clear History
export const clearSearchHistory = async () => {
  try {
    const snapshot = await getDocs(historyCollection);
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'searchHistory', d.id)));
    await Promise.all(deletePromises);
  } catch (error) { }
};