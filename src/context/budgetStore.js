import { create } from 'zustand';
import {
    collection,
    getDocs,
    setDoc,
    doc,
    query,
    where,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import useAuthStore from './authStore';

const useBudgetStore = create((set, get) => ({
    budgets: [],
    loading: false,
    error: null,

    fetchBudgets: async () => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) return;

        set({ loading: true, error: null });
        try {
            const q = query(
                collection(db, "budgets"),
                where("userId", "==", currentUser.uid)
            );

            const querySnapshot = await getDocs(q);
            const budgets = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            set({ budgets });
        } catch (error) {
            console.error("Error fetching budgets:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    upsertBudget: async (budgetData) => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) throw new Error("User not authenticated");

        set({ loading: true, error: null });
        try {
            // Using category name as ID relative to user to ensure one budget per category per user
            const budgetId = `${currentUser.uid}_${budgetData.category}`;
            const budgetRef = doc(db, "budgets", budgetId);

            const newBudget = {
                ...budgetData,
                userId: currentUser.uid,
                updatedAt: new Date()
            };

            await setDoc(budgetRef, newBudget, { merge: true });

            // Update local state
            const currentBudgets = get().budgets;
            const index = currentBudgets.findIndex(b => b.category === budgetData.category);

            if (index !== -1) {
                const updatedBudgets = [...currentBudgets];
                updatedBudgets[index] = { ...newBudget, id: budgetId };
                set({ budgets: updatedBudgets });
            } else {
                set({ budgets: [...currentBudgets, { ...newBudget, id: budgetId }] });
            }
        } catch (error) {
            console.error("Error saving budget:", error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    deleteBudget: async (budgetId) => {
        set({ loading: true, error: null });
        try {
            await deleteDoc(doc(db, "budgets", budgetId));
            set(state => ({
                budgets: state.budgets.filter(b => b.id !== budgetId)
            }));
        } catch (error) {
            console.error("Error deleting budget:", error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));

export default useBudgetStore;
