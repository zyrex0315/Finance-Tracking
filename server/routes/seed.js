import express from 'express';
import Transaction from '../models/Transaction.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const sampleTransactions = [];
        const categories = [
            'Food & Dining', 'Shopping', 'Housing', 'Transportation',
            'Entertainment', 'Healthcare', 'Travel', 'Utilities',
            'Education', 'Other'
        ];

        // Generate 50 random transactions
        for (let i = 0; i < 50; i++) {
            const isIncome = Math.random() > 0.7;
            const category = categories[Math.floor(Math.random() * categories.length)];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Past 60 days

            sampleTransactions.push({
                description: `Test Transaction ${i + 1}`,
                amount: Math.floor(Math.random() * 10000) + 100,
                category: isIncome ? 'Other' : category,
                date: date,
                isIncome: isIncome,
                user: req.user.id
            });
        }

        await Transaction.insertMany(sampleTransactions);

        res.json({ message: 'Seeded 50 transactions successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
