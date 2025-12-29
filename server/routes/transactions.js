import express from 'express';
import Transaction from '../models/Transaction.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all transactions with pagination and filtering
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, startDate, endDate } = req.query;
        const query = { user: req.user.id };

        // Search Filter
        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Category Filter
        if (category) {
            query.category = category;
        }

        // Date Range Filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Transaction.countDocuments(query);

        res.json({
            transactions,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalTransactions: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new transaction
router.post('/', auth, async (req, res) => {
    try {
        const newTransaction = new Transaction({
            ...req.body,
            user: req.user.id
        });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Ensure user owns the transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
