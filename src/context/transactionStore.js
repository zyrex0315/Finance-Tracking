import { create } from 'zustand';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import useAuthStore from './authStore';

const useTransactionStore = create((set, get) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchTransactions: async () => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) return;

        set({ loading: true, error: null });
        try {
            const q = query(
                collection(db, "transactions"),
                where("userId", "==", currentUser.uid),
                orderBy("date", "desc")
            );

            const querySnapshot = await getDocs(q);
            const transactions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate() // Convert Firestore Timestamp to Date
            }));

            set({ transactions });
        } catch (error) {
            console.error("Error fetching transactions:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    addTransaction: async (transactionData) => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) return;

        set({ loading: true, error: null });
        try {
            const newTransaction = {
                userId: currentUser.uid,
                ...transactionData,
                createdAt: serverTimestamp() // Firestore server timestamp
            };

            const docRef = await addDoc(collection(db, "transactions"), newTransaction);


            const addedTransaction = {
                id: docRef.id,
                ...newTransaction,
                date: transactionData.date // Keep local Date object for immediate display
            };

            set(state => ({
                transactions: [addedTransaction, ...state.transactions]
            }));

        } catch (error) {
            console.error("Error adding transaction:", error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    deleteTransaction: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteDoc(doc(db, "transactions", id));

            set(state => ({
                transactions: state.transactions.filter(t => t.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting transaction:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    }
}));

export default useTransactionStore;
