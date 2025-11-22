const API_URL = 'http://localhost:5000/api';

export const fetchTransactions = async () => {
    const response = await fetch(`${API_URL}/transactions`);
    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }
    return response.json();
};

export const addTransaction = async (transaction) => {
    const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) {
        throw new Error('Failed to add transaction');
    }
    return response.json();
};

export const deleteTransaction = async (id) => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete transaction');
    }
    return response.json();
};
