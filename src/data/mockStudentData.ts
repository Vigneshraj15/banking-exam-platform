import { SavedAttempt } from '../types';

const STORAGE_KEY = 'parikshabank_student_attempts_v1';

// Retrieve all authentic user attempts saved in localStorage
export const getSavedAttempts = (): SavedAttempt[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved attempts from localStorage', err);
    return [];
  }
};

// Persist a new attempt
export const saveStudentAttempt = (attempt: SavedAttempt): SavedAttempt[] => {
  try {
    const existing = getSavedAttempts();
    const updated = [attempt, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save attempt to localStorage', err);
    return getSavedAttempts();
  }
};

// Delete a specific attempt
export const deleteSavedAttempt = (attemptId: string): SavedAttempt[] => {
  try {
    const existing = getSavedAttempts();
    const filtered = existing.filter(a => a.id !== attemptId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete attempt', err);
    return getSavedAttempts();
  }
};

// Clear all attempts
export const clearAllSavedAttempts = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear attempts', err);
  }
};
