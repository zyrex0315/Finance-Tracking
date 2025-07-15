import { addDays, format, subDays } from 'date-fns';
import { nanoid } from 'nanoid';

// Generate random transactions for the past 90 days
const generateTransactions = () => {
  const categories = [
    'Food & Dining',
    'Shopping',
    'Housing',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Travel',
    'Utilities',
    'Education',
    'Other'
  ];

  const foodDescriptions = [
    'Grocery shopping', 'Restaurant dinner', 'Coffee shop', 'Food delivery',
    'Lunch at work', 'Bakery', 'Fast food', 'Smoothie bar'
  ];

  const shoppingDescriptions = [
    'Online purchase', 'Clothing store', 'Electronics', 'Home decor',
    'Bookstore', 'Department store', 'Shoes', 'Gift shop'
  ];

  const housingDescriptions = [
    'Rent payment', 'Mortgage', 'Home insurance', 'Property tax',
    'Home repairs', 'Furniture', 'Gardening supplies', 'Cleaning service'
  ];

  const transportationDescriptions = [
    'Gas', 'Car payment', 'Car insurance', 'Parking fee',
    'Public transit', 'Ride share', 'Car maintenance', 'Toll'
  ];

  const entertainmentDescriptions = [
    'Movie tickets', 'Concert', 'Streaming service', 'Sports event',
    'Video games', 'Hobby supplies', 'Theater', 'Museum'
  ];

  const healthcareDescriptions = [
    'Doctor visit', 'Medication', 'Health insurance', 'Dental care',
    'Eye care', 'Gym membership', 'Therapy session', 'Vitamins'
  ];

  const travelDescriptions = [
    'Flight tickets', 'Hotel stay', 'Car rental', 'Travel insurance',
    'Vacation package', 'Souvenirs', 'Tour booking', 'Passport fees'
  ];
  
  const utilitiesDescriptions = [
    'Electricity bill', 'Water bill', 'Internet bill', 'Phone bill',
    'Garbage collection', 'Streaming subscription', 'Gas bill', 'Cable TV'
  ];

  const educationDescriptions = [
    'Tuition', 'Books', 'Online course', 'School supplies',
    'Tutoring', 'Workshop fee', 'Education software', 'Professional certification'
  ];

  const otherDescriptions = [
    'Charity donation', 'Gift', 'Membership fee', 'Subscription',
    'Pet supplies', 'Haircut', 'Banking fee', 'Miscellaneous'
  ];

  const incomeDescriptions = [
    'Salary deposit', 'Freelance payment', 'Dividend income', 'Tax refund',
    'Gift received', 'Side hustle', 'Investment return', 'Reimbursement'
  ];

  const descriptionsByCategory = {
    'Food & Dining': foodDescriptions,
    'Shopping': shoppingDescriptions,
    'Housing': housingDescriptions,
    'Transportation': transportationDescriptions,
    'Entertainment': entertainmentDescriptions,
    'Healthcare': healthcareDescriptions,
    'Travel': travelDescriptions,
    'Utilities': utilitiesDescriptions,
    'Education': educationDescriptions,
    'Other': otherDescriptions
  };

  const transactions = [];
  const today = new Date();
  const startDate = subDays(today, 90);

  // Add one income transaction per week
  for (let i = 0; i < 12; i++) {
    const date = format(addDays(startDate, i * 7), 'yyyy-MM-dd');
    transactions.push({
      id: nanoid(),
      amount: 2000 + Math.random() * 500,
      category: 'Other',
      description: incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)],
      date,
      isIncome: true
    });
  }

  // Add random expenses
  for (let i = 0; i < 200; i++) {
    const dayOffset = Math.floor(Math.random() * 90);
    const date = format(addDays(startDate, dayOffset), 'yyyy-MM-dd');
    const category = categories[Math.floor(Math.random() * categories.length)];
    const descriptions = descriptionsByCategory[category];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    let amount;
    switch (category) {
      case 'Housing':
        amount = 500 + Math.random() * 1500;
        break;
      case 'Travel':
        amount = 100 + Math.random() * 900;
        break;
      case 'Food & Dining':
        amount = 10 + Math.random() * 90;
        break;
      default:
        amount = 10 + Math.random() * 200;
    }

    transactions.push({
      id: nanoid(),
      amount: Math.round(amount * 100) / 100,
      category,
      description,
      date,
      isIncome: false
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate and store transactions once
const transactions = generateTransactions();

// Calculate monthly spending for the chart
export const getMonthlySpending = () => {
  const monthly = {};
  transactions.forEach((tx) => {
    if (!tx.isIncome) {
      const month = tx.date.slice(0, 7); // yyyy-MM
      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += tx.amount;
    }
  });
  // Return as array sorted by month
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount: Math.round(amount * 100) / 100 }));
};

// Calculate spending by category
export const getCategorySpending = () => {
  const byCategory = {};
  transactions.forEach((tx) => {
    if (!tx.isIncome) {
      if (!byCategory[tx.category]) byCategory[tx.category] = 0;
      byCategory[tx.category] += tx.amount;
    }
  });
  return Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }));
};

export const getTransactions = () => {
  return transactions;
};

export const getRecentTransactions = (count = 5) => {
  return transactions.slice(0, count);
};

export const calculateTotalBalance = () => {
  let income = 0, expenses = 0;
  transactions.forEach((tx) => {
    if (tx.isIncome) income += tx.amount;
    else expenses += tx.amount;
  });
  return Math.round((income - expenses) * 100) / 100;
};

export const calculateMonthlyIncome = () => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  let income = 0;
  transactions.forEach((tx) => {
    if (tx.isIncome && tx.date.startsWith(currentMonth)) income += tx.amount;
  });
  return Math.round(income * 100) / 100;
};

export const calculateMonthlyExpenses = () => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  let expenses = 0;
  transactions.forEach((tx) => {
    if (!tx.isIncome && tx.date.startsWith(currentMonth)) expenses += tx.amount;
  });
  return Math.round(expenses * 100) / 100;
};
