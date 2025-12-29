import { create } from 'zustand';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';

const useAuthStore = create((set) => ({
    currentUser: null,
    loading: true,
    error: null,

    // Initialize listener
    initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ currentUser: user, loading: false });
        });
        return unsubscribe;
    },

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signup: async (email, password, fullName) => {
        set({ loading: true, error: null });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with full name
            if (fullName) {
                // Import updateProfile dynamically or ensure it's imported at top
                const { updateProfile } = await import('firebase/auth');
                await updateProfile(userCredential.user, {
                    displayName: fullName
                });

                // Force update state with new display name
                set((state) => ({
                    currentUser: { ...state.currentUser, displayName: fullName }
                }));
            }
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await signOut(auth);
            set({ currentUser: null });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    }
}));

export default useAuthStore;
