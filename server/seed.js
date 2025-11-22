import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker';

const sampleTransactions = [
    { description: 'Grocery shopping', amount: 4500, category: 'Food & Dining', date: new Date(), isIncome: false },
    { description: 'Salary', amount: 150000, category: 'Other', date: new Date(), isIncome: true },
    { description: 'Internet Bill', amount: 1200, category: 'Utilities', date: new Date(Date.now() - 86400000 * 2), isIncome: false },
    { description: 'Coffee', amount: 250, category: 'Food & Dining', date: new Date(Date.now() - 86400000 * 5), isIncome: false },
    { description: 'Freelance Work', amount: 25000, category: 'Other', date: new Date(Date.now() - 86400000 * 10), isIncome: true },
];

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Transaction.deleteMany({});
        await Transaction.insertMany(sampleTransactions);
        console.log('Database seeded!');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
