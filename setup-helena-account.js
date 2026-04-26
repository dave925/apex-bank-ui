// Helena Malm Account Setup Script
// Run this script to create Helena Malm's account with $20 million and realistic transactions

function setupHelenaMalmAccount() {
    // Create Helena Malm's user account
    const helenaAccount = {
        id: Date.now(),
        firstName: 'Helena',
        lastName: 'Malm',
        name: 'Helena Malm',
        email: 'helena.malm@apexbank.com',
        phone: '+1-555-0123-4567',
        accountNumber: '45284731',
        avatar: 'https://picsum.photos/seed/helena-malm/80/80.jpg',
        createdAt: new Date('2024-01-15'),
        isVerified: true
    };

    // Set up account balances
    const accountData = {
        spending: {
            balance: 15000000.00, // $15 million in spending
            type: 'spending'
        },
        savings: {
            balance: 5000000.00,  // $5 million in savings
            type: 'savings'
        }
    };

    // Generate realistic transactions
    const realisticTransactions = [
        // Large deposits and investments
        {
            id: 1001,
            name: 'Investment Return - Tech Fund',
            amount: 2500000.00,
            date: new Date('2024-12-01'),
            type: 'deposit',
            category: 'Investment',
            description: 'Q4 2024 Tech Fund Distribution'
        },
        {
            id: 1002,
            name: 'Real Estate Sale - Manhattan',
            amount: 8500000.00,
            date: new Date('2024-11-15'),
            type: 'deposit',
            category: 'Real Estate',
            description: 'Commercial property sale proceeds'
        },
        {
            id: 1003,
            name: 'Stock Dividend - Apple Inc',
            amount: 450000.00,
            date: new Date('2024-11-01'),
            type: 'deposit',
            category: 'Investment',
            description: 'Quarterly dividend payment'
        },
        {
            id: 1004,
            name: 'Business Partnership Profit',
            amount: 3200000.00,
            date: new Date('2024-10-20'),
            type: 'deposit',
            category: 'Business',
            description: 'Q3 2024 profit distribution'
        },
        
        // Luxury purchases
        {
            id: 1005,
            name: 'Ferrari SF90 Stradale',
            amount: -625000.00,
            date: new Date('2024-12-10'),
            type: 'payment',
            category: 'Automotive',
            description: 'Luxury sports car purchase'
        },
        {
            id: 1006,
            name: 'Rolex Daytona Watch',
            amount: -28500.00,
            date: new Date('2024-12-05'),
            type: 'payment',
            category: 'Luxury',
            description: 'Luxury timepiece purchase'
        },
        {
            id: 1007,
            name: 'Hermès Birkin Bag',
            amount: -12000.00,
            date: new Date('2024-11-28'),
            type: 'payment',
            category: 'Fashion',
            description: 'Designer handbag purchase'
        },
        
        // Real estate and property
        {
            id: 1008,
            name: 'Penthouse Maintenance',
            amount: -15000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Property',
            description: 'Monthly building maintenance fee'
        },
        {
            id: 1009,
            name: 'Property Tax - NYC',
            amount: -45000.00,
            date: new Date('2024-11-15'),
            type: 'payment',
            category: 'Property',
            description: 'Quarterly property tax payment'
        },
        {
            id: 1010,
            name: 'Home Insurance Premium',
            amount: -8500.00,
            date: new Date('2024-11-01'),
            type: 'payment',
            category: 'Insurance',
            description: 'Annual home insurance payment'
        },
        
        // Travel and entertainment
        {
            id: 1011,
            name: 'Private Jet Charter - Monaco',
            amount: -45000.00,
            date: new Date('2024-12-20'),
            type: 'payment',
            category: 'Travel',
            description: 'Round trip private jet charter'
        },
        {
            id: 1012,
            name: 'Hotel du Cap-Eden-Roc',
            amount: -18000.00,
            date: new Date('2024-12-18'),
            type: 'payment',
            category: 'Travel',
            description: '5-night luxury suite accommodation'
        },
        {
            id: 1013,
            name: 'Michelin Star Dinner',
            amount: -3200.00,
            date: new Date('2024-12-17'),
            type: 'payment',
            category: 'Dining',
            description: 'Party of 4 at 3-Michelin star restaurant'
        },
        
        // Business and professional services
        {
            id: 1014,
            name: 'Legal Services - Corporate',
            amount: -75000.00,
            date: new Date('2024-12-08'),
            type: 'payment',
            category: 'Professional',
            description: 'Corporate legal consultation fees'
        },
        {
            id: 1015,
            name: 'Financial Advisory - Goldman Sachs',
            amount: -125000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Professional',
            description: 'Wealth management quarterly fee'
        },
        {
            id: 1016,
            name: 'Accounting Services - PwC',
            amount: -35000.00,
            date: new Date('2024-11-20'),
            type: 'payment',
            category: 'Professional',
            description: 'Annual tax preparation and audit'
        },
        
        // Investment activities
        {
            id: 1017,
            name: 'Cryptocurrency Purchase - Bitcoin',
            amount: -500000.00,
            date: new Date('2024-12-15'),
            type: 'payment',
            category: 'Investment',
            description: 'Digital asset investment'
        },
        {
            id: 1018,
            name: 'Art Auction - Sotheby\'s',
            amount: -1200000.00,
            date: new Date('2024-11-10'),
            type: 'payment',
            category: 'Art',
            description: 'Contemporary art piece acquisition'
        },
        {
            id: 1019,
            name: 'Wine Collection Purchase',
            amount: -85000.00,
            date: new Date('2024-10-25'),
            type: 'payment',
            category: 'Investment',
            description: 'Vintage wine portfolio addition'
        },
        
        // Regular expenses
        {
            id: 1020,
            name: 'Private School Tuition',
            amount: -45000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Education',
            description: 'Quarterly private school fees'
        },
        {
            id: 1021,
            name: 'Personal Trainer - Annual',
            amount: -24000.00,
            date: new Date('2024-11-15'),
            type: 'payment',
            category: 'Health',
            description: 'Annual personal training package'
        },
        {
            id: 1022,
            name: 'Yacht Club Membership',
            amount: -18000.00,
            date: new Date('2024-11-01'),
            type: 'payment',
            category: 'Lifestyle',
            description: 'Annual yacht club membership fee'
        },
        
        // Recent smaller transactions
        {
            id: 1023,
            name: 'Tesla Model S Plaid',
            amount: -135000.00,
            date: new Date('2024-12-22'),
            type: 'payment',
            category: 'Automotive',
            description: 'Electric vehicle purchase'
        },
        {
            id: 1024,
            name: 'Charitable Donation - Red Cross',
            amount: -100000.00,
            date: new Date('2024-12-21'),
            type: 'payment',
            category: 'Charity',
            description: 'Year-end charitable contribution'
        },
        {
            id: 1025,
            name: 'Diamond Necklace - Cartier',
            amount: -95000.00,
            date: new Date('2024-12-19'),
            type: 'payment',
            category: 'Luxury',
            description: 'Fine jewelry purchase'
        },
        {
            id: 1026,
            name: 'Spa Retreat - Switzerland',
            amount: -12000.00,
            date: new Date('2024-12-16'),
            type: 'payment',
            category: 'Wellness',
            description: 'Luxury wellness retreat package'
        },
        {
            id: 1027,
            name: 'Concert Tickets - VIP Box',
            amount: -8500.00,
            date: new Date('2024-12-14'),
            type: 'payment',
            category: 'Entertainment',
            description: 'VIP concert tickets for 8 people'
        },
        {
            id: 1028,
            name: 'Designer Clothing - Chanel',
            amount: -22000.00,
            date: new Date('2024-12-12'),
            type: 'payment',
            category: 'Fashion',
            description: 'Seasonal designer collection'
        },
        {
            id: 1029,
            name: 'Gourmet Groceries - Dean & DeLuca',
            amount: -2800.00,
            date: new Date('2024-12-11'),
            type: 'payment',
            category: 'Groceries',
            description: 'Premium grocery delivery'
        },
        {
            id: 1030,
            name: 'Wine Collection - Bordeaux',
            amount: -35000.00,
            date: new Date('2024-12-09'),
            type: 'payment',
            category: 'Investment',
            description: 'Fine wine acquisition'
        }
    ];

    // Sort transactions by date (most recent first)
    realisticTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save to localStorage
    localStorage.setItem('apexCurrentUser', JSON.stringify(helenaAccount));
    localStorage.setItem('apexSession', JSON.stringify(helenaAccount));
    localStorage.setItem('apexTransactions', JSON.stringify(realisticTransactions));
    localStorage.setItem('apexSpendingBalance', accountData.spending.balance.toString());
    localStorage.setItem('apexSavingsBalance', accountData.savings.balance.toString());
    
    // Also save to the app state structure
    if (typeof apexState !== 'undefined') {
        apexState.currentUser = helenaAccount;
        apexState.transactions = realisticTransactions;
        apexState.balance = accountData.spending.balance;
        apexState.savingsBalance = accountData.savings.balance;
    }

    console.log('Helena Malm account created successfully!');
    console.log('Account Balance: $20,000,000.00');
    console.log('Transactions: ' + realisticTransactions.length + ' realistic transactions added');
    
    // Display summary
    const totalDeposits = realisticTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPayments = realisticTransactions
        .filter(t => t.type === 'payment')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    console.log(`Total Deposits: $${totalDeposits.toLocaleString()}`);
    console.log(`Total Payments: $${totalPayments.toLocaleString()}`);
    console.log('Account is ready for use!');
    
    return {
        account: helenaAccount,
        transactions: realisticTransactions,
        balances: accountData
    };
}

// Auto-execute if running in browser console
if (typeof window !== 'undefined') {
    setupHelenaMalmAccount();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupHelenaMalmAccount };
}
