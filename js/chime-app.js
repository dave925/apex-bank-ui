// APEX Bank Application JavaScript

// Global State
const apexState = {
    currentUser: null,
    currentScreen: 'login',
    balance: 0.00,
    transactions: [],
    goals: [
        {
            id: 1,
            name: 'Emergency Fund',
            amount: 0.00,
            target: 2000.00,
            icon: 'fa-home',
            color: 'var(--apex-primary-green)'
        },
        {
            id: 2,
            name: 'Vacation Fund',
            amount: 0.00,
            target: 2000.00,
            icon: 'fa-plane',
            color: 'var(--apex-info)'
        },
        {
            id: 3,
            name: 'New Laptop',
            amount: 0.00,
            target: 600.00,
            icon: 'fa-laptop',
            color: 'var(--apex-warning)'
        },
        {
            id: 4,
            name: 'Holiday Gifts',
            amount: 0.00,
            target: 600.00,
            icon: 'fa-gift',
            color: 'var(--apex-error)'
        }
    ],
    users: [],
    pendingVerification: null,
    verificationCode: null
};

// Time-based Greeting Function
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    const name = apexState.currentUser ? apexState.currentUser.name.split(' ')[0] : 'User';
    
    if (hour < 12) {
        return `Good morning, ${name}`;
    } else if (hour < 17) {
        return `Good afternoon, ${name}`;
    } else {
        return `Good evening, ${name}`;
    }
}

// Generate Unique Account Number
function generateAccountNumber() {
    // Generate a random 8-digit account number starting with 45 (APEX bank code)
    const prefix = '45';
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return prefix + randomDigits;
}

// Format Account Number for Display (**** **** **** XXXX)
function formatAccountNumber(accountNumber) {
    if (!accountNumber || accountNumber.length !== 8) return '**** **** **** 8234'; // fallback
    const lastFour = accountNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
}

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(`${screenId}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        apexState.currentScreen = screenId;
        
        // Update navigation
        updateNavigation(screenId);
        
        // Update mobile navigation
        updateMobileNavigation(screenId);
        
        // Initialize screen-specific features
        initializeScreen(screenId);
    }
}

function updateNavigation(activeScreen) {
    document.querySelectorAll('.apex-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeScreen}`) {
            link.classList.add('active');
        }
    });
}

function updateMobileNavigation(activeScreen) {
    document.querySelectorAll('.apex-mobile-item').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeScreen}`) {
            link.classList.add('active');
        }
    });
}

function initializeScreen(screenId) {
    switch(screenId) {
        case 'home':
            initializeHomeScreen();
            break;
        case 'account':
            initializeAccountScreen();
            break;
        case 'goals':
            initializeGoalsScreen();
            break;
        case 'move':
            initializeMoveScreen();
            break;
        case 'credit':
            initializeCreditScreen();
            break;
        case 'analytics':
            initializeAnalyticsScreen();
            break;
        case 'settings':
            initializeSettingsScreen();
            break;
        case 'help':
            initializeHelpScreen();
            break;
        case 'notifications':
            initializeNotificationsScreen();
            break;
        case 'profile':
            initializeProfileScreen();
            break;
    }
}

// Authentication Functions
function apexLogin() {
    alert('apexLogin function called!');
    console.log('apexLogin function called');
    
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    
    console.log('Login attempt - Email:', email);
    console.log('Login attempt - Password:', password ? '***' : '');
    console.log('Remember me:', rememberMe);
    
    // Validation
    if (!email || !password) {
        chimeToast('Please enter your email and password', 'error');
        return;
    }
    
    // Load users from localStorage
    loadUsers();
    console.log('Users loaded:', apexState.users.length);
    console.log('Available emails:', apexState.users.map(u => u.email));
    
    // Check if user exists in our user database
    const user = apexState.users.find(u => u.email === email && u.password === password);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
        // Ensure user has an account number (for existing users)
        if (!user.accountNumber) {
            user.accountNumber = generateAccountNumber();
            // Update user in storage
            const userIndex = apexState.users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                apexState.users[userIndex].accountNumber = user.accountNumber;
                saveUsers();
            }
        }
        
        // For Helena Malm, set up her account data
        if (user.email === 'westcoat.madfish@gmail.com') {
            console.log('Setting up Helena Malm account data...');
            
            // Set up account balances (total $20 million)
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
                    name: 'Private Jet Charter - Monaco',
                    amount: -45000.00,
                    date: new Date('2024-12-20'),
                    type: 'payment',
                    category: 'Travel',
                    description: 'Round trip private jet charter'
                },
                {
                    id: 1007,
                    name: 'Art Auction - Sotheby\'s',
                    amount: -1200000.00,
                    date: new Date('2024-11-10'),
                    type: 'payment',
                    category: 'Art',
                    description: 'Contemporary art piece acquisition'
                },
                {
                    id: 1008,
                    name: 'Hotel du Cap-Eden-Roc',
                    amount: -18000.00,
                    date: new Date('2024-12-18'),
                    type: 'payment',
                    category: 'Travel',
                    description: '5-night luxury suite accommodation'
                },
                {
                    id: 1009,
                    name: 'Financial Advisory - Goldman Sachs',
                    amount: -125000.00,
                    date: new Date('2024-12-01'),
                    type: 'payment',
                    category: 'Professional',
                    description: 'Wealth management quarterly fee'
                },
                {
                    id: 1010,
                    name: 'Cryptocurrency Purchase - Bitcoin',
                    amount: -500000.00,
                    date: new Date('2024-12-15'),
                    type: 'payment',
                    category: 'Investment',
                    description: 'Digital asset investment'
                },
                {
                    id: 1011,
                    name: 'Tesla Model S Plaid',
                    amount: -135000.00,
                    date: new Date('2024-12-22'),
                    type: 'payment',
                    category: 'Automotive',
                    description: 'Electric vehicle purchase'
                },
                {
                    id: 1012,
                    name: 'Charitable Donation - Red Cross',
                    amount: -100000.00,
                    date: new Date('2024-12-21'),
                    type: 'payment',
                    category: 'Charity',
                    description: 'Year-end charitable contribution'
                },
                {
                    id: 1013,
                    name: 'Rolex Daytona Watch',
                    amount: -28500.00,
                    date: new Date('2024-12-05'),
                    type: 'payment',
                    category: 'Luxury',
                    description: 'Luxury timepiece purchase'
                },
                {
                    id: 1014,
                    name: 'Hermès Birkin Bag',
                    amount: -12000.00,
                    date: new Date('2024-11-28'),
                    type: 'payment',
                    category: 'Fashion',
                    description: 'Designer handbag purchase'
                },
                {
                    id: 1015,
                    name: 'Penthouse Maintenance',
                    amount: -15000.00,
                    date: new Date('2024-12-01'),
                    type: 'payment',
                    category: 'Property',
                    description: 'Monthly building maintenance fee'
                }
            ];
            
            // Sort transactions by date (most recent first)
            realisticTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Save to localStorage
            localStorage.setItem('apexTransactions', JSON.stringify(realisticTransactions));
            localStorage.setItem('apexSpendingBalance', accountData.spending.balance.toString());
            localStorage.setItem('apexSavingsBalance', accountData.savings.balance.toString());
            
        };
            
        // Generate realistic transactions
        const realisticTransactions = [
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
                name: 'Private Jet Charter - Monaco',
                amount: -45000.00,
                date: new Date('2024-12-20'),
                type: 'payment',
                category: 'Travel',
                description: 'Round trip private jet charter'
            },
            {
                id: 1007,
                name: 'Art Auction - Sotheby\'s',
                amount: -1200000.00,
                date: new Date('2024-11-10'),
                type: 'payment',
                category: 'Art',
                description: 'Contemporary art piece acquisition'
            },
            {
                id: 1008,
                name: 'Hotel du Cap-Eden-Roc',
                amount: -18000.00,
                date: new Date('2024-12-18'),
                type: 'payment',
                category: 'Travel',
                description: '5-night luxury suite accommodation'
            },
            {
                id: 1009,
                name: 'Financial Advisory - Goldman Sachs',
                amount: -125000.00,
                date: new Date('2024-12-01'),
                type: 'payment',
                category: 'Professional',
                description: 'Wealth management quarterly fee'
            },
            {
                id: 1010,
                name: 'Cryptocurrency Purchase - Bitcoin',
                amount: -500000.00,
                date: new Date('2024-12-15'),
                type: 'payment',
                category: 'Investment',
                description: 'Digital asset investment'
            },
            {
                id: 1011,
                name: 'Tesla Model S Plaid',
                amount: -135000.00,
                date: new Date('2024-12-22'),
                type: 'payment',
                category: 'Automotive',
                description: 'Electric vehicle purchase'
            },
            {
                id: 1012,
                name: 'Charitable Donation - Red Cross',
                amount: -100000.00,
                date: new Date('2024-12-21'),
                type: 'payment',
                category: 'Charity',
                description: 'Year-end charitable contribution'
            },
            {
                id: 1013,
                name: 'Rolex Daytona Watch',
                amount: -28500.00,
                date: new Date('2024-12-05'),
                type: 'payment',
                category: 'Luxury',
                description: 'Luxury timepiece purchase'
            },
            {
                id: 1014,
                name: 'Hermès Birkin Bag',
                amount: -12000.00,
                date: new Date('2024-11-28'),
                type: 'payment',
                category: 'Fashion',
                description: 'Designer handbag purchase'
            },
            {
                id: 1015,
                name: 'Penthouse Maintenance',
                amount: -15000.00,
                date: new Date('2024-12-01'),
                type: 'payment',
                category: 'Property',
                description: 'Monthly building maintenance fee'
            }
        ];
            
        // Sort transactions by date (most recent first)
        realisticTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
        // Save to localStorage
        localStorage.setItem('apexTransactions', JSON.stringify(realisticTransactions));
        localStorage.setItem('apexSpendingBalance', accountData.spending.balance.toString());
        localStorage.setItem('apexSavingsBalance', accountData.savings.balance.toString());
            
        // Update app state
        apexState.transactions = realisticTransactions;
        apexState.balance = accountData.spending.balance;
        apexState.savingsBalance = accountData.savings.balance;
            
        console.log('Helena account data set up successfully');
        console.log('Balance:', apexState.balance);
        console.log('Transactions:', apexState.transactions.length);
    }
        
    // Successful login
    apexState.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountNumber: user.accountNumber,
        avatar: user.avatar || `https://picsum.photos/seed/${user.email}/80/80.jpg`
    };
        
    // Save session
    sessionStorage.setItem('apexSession', JSON.stringify(apexState.currentUser));
        
    // Save to localStorage if remember me is checked
    if (rememberMe) {
        localStorage.setItem('apexUser', JSON.stringify({
            email: user.email,
            password: user.password
        }));
    }
        
    chimeToast(`Welcome back, ${apexState.currentUser.name}!`, 'success');
        
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
        
    // Clear form
    document.getElementById('loginForm')?.reset();
        
    } else {
    // Failed login
    chimeToast('Invalid email or password', 'error');
        
    // Add shake animation
    const authCard = document.querySelector('.apex-auth-card');
    authCard.classList.add('shake');
    setTimeout(() => {
        authCard.classList.remove('shake');
    }, 500);
}

// Account Creation Functions
function createAccount() {
    alert('createAccount function called!');
    console.log('createAccount function called');
    
    const firstName = document.getElementById('signupFirstName')?.value.trim();
    const lastName = document.getElementById('signupLastName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const phone = document.getElementById('signupPhone')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    console.log('Form values:', { firstName, lastName, email, phone, password: password ? '***' : '', confirmPassword: confirmPassword ? '***' : '', agreeTerms });
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        chimeToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 8) {
        chimeToast('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        chimeToast('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        chimeToast('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Clear database completely
    console.log('Clearing database for new account...');
    localStorage.clear();
    apexState.users = [];
    apexState.transactions = [];
    apexState.goals = [];
    apexState.currentUser = null;
    apexState.balance = 0;
    apexState.savingsBalance = 0;
    
    // Create new user with $20 million setup
    const newUser = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        password: password, // In production, this should be hashed
        accountNumber: generateAccountNumber(),
        avatar: `https://picsum.photos/seed/${email}/80/80.jpg`,
        createdAt: new Date(),
        isVerified: false
    };
    
    // Generate realistic transactions for new user
    const realisticTransactions = generateRealisticTransactions(newUser.name);
    
    // Set up account balances (total $20 million)
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
    
    // Store pending user for verification with account data
    apexState.pendingVerification = {
        ...newUser,
        accountData: accountData,
        transactions: realisticTransactions
    };
    
    // Generate verification code
    apexState.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Display verification code
    displayVerificationCode(apexState.verificationCode);
    
    // Show verification screen
    document.getElementById('signup-screen').style.display = 'none';
    document.getElementById('verification-screen').style.display = 'block';
    
    chimeToast('Account created! Please verify your email', 'success');
}

// Generate realistic transactions for any user
function generateRealisticTransactions(userName) {
    const transactions = [
        {
            id: Date.now() + 1,
            name: 'Investment Return - Tech Fund',
            amount: 2500000.00,
            date: new Date('2024-12-01'),
            type: 'deposit',
            category: 'Investment',
            description: 'Q4 2024 Tech Fund Distribution'
        },
        {
            id: Date.now() + 2,
            name: 'Real Estate Sale - Manhattan',
            amount: 8500000.00,
            date: new Date('2024-11-15'),
            type: 'deposit',
            category: 'Real Estate',
            description: 'Commercial property sale proceeds'
        },
        {
            id: Date.now() + 3,
            name: 'Stock Dividend - Apple Inc',
            amount: 450000.00,
            date: new Date('2024-11-01'),
            type: 'deposit',
            category: 'Investment',
            description: 'Quarterly dividend payment'
        },
        {
            id: Date.now() + 4,
            name: 'Business Partnership Profit',
            amount: 3200000.00,
            date: new Date('2024-10-20'),
            type: 'deposit',
            category: 'Business',
            description: 'Q3 2024 profit distribution'
        },
        {
            id: Date.now() + 5,
            name: 'Ferrari SF90 Stradale',
            amount: -625000.00,
            date: new Date('2024-12-10'),
            type: 'payment',
            category: 'Automotive',
            description: 'Luxury sports car purchase'
        },
        {
            id: Date.now() + 6,
            name: 'Private Jet Charter - Monaco',
            amount: -45000.00,
            date: new Date('2024-12-20'),
            type: 'payment',
            category: 'Travel',
            description: 'Round trip private jet charter'
        },
        {
            id: Date.now() + 7,
            name: 'Art Auction - Sotheby\'s',
            amount: -1200000.00,
            date: new Date('2024-11-10'),
            type: 'payment',
            category: 'Art',
            description: 'Contemporary art piece acquisition'
        },
        {
            id: Date.now() + 8,
            name: 'Hotel du Cap-Eden-Roc',
            amount: -18000.00,
            date: new Date('2024-12-18'),
            type: 'payment',
            category: 'Travel',
            description: '5-night luxury suite accommodation'
        },
        {
            id: Date.now() + 9,
            name: 'Financial Advisory - Goldman Sachs',
            amount: -125000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Professional',
            description: 'Wealth management quarterly fee'
        },
        {
            id: Date.now() + 10,
            name: 'Cryptocurrency Purchase - Bitcoin',
            amount: -500000.00,
            date: new Date('2024-12-15'),
            type: 'payment',
            category: 'Investment',
            description: 'Digital asset investment'
        },
        {
            id: Date.now() + 11,
            name: 'Tesla Model S Plaid',
            amount: -135000.00,
            date: new Date('2024-12-22'),
            type: 'payment',
            category: 'Automotive',
            description: 'Electric vehicle purchase'
        },
        {
            id: Date.now() + 12,
            name: 'Charitable Donation - Red Cross',
            amount: -100000.00,
            date: new Date('2024-12-21'),
            type: 'payment',
            category: 'Charity',
            description: 'Year-end charitable contribution'
        },
        {
            id: Date.now() + 13,
            name: 'Rolex Daytona Watch',
            amount: -28500.00,
            date: new Date('2024-12-05'),
            type: 'payment',
            category: 'Luxury',
            description: 'Luxury timepiece purchase'
        },
        {
            id: Date.now() + 14,
            name: 'Hermès Birkin Bag',
            amount: -12000.00,
            date: new Date('2024-11-28'),
            type: 'payment',
            category: 'Fashion',
            description: 'Designer handbag purchase'
        },
        {
            id: Date.now() + 15,
            name: 'Penthouse Maintenance',
            amount: -15000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Property',
            description: 'Monthly building maintenance fee'
        }
    ];
    
    // Sort by date (most recent first)
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function displayVerificationCode(code) {
    const codeValue = document.getElementById('codeValue');
    if (codeValue) {
        codeValue.textContent = code;
        // Add animation
        codeValue.style.animation = 'pulse 2s infinite';
    }
}

function handleVerificationInput(input, index) {
    // Only allow numbers
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // Add visual feedback
    if (input.value.length === 1) {
        input.style.borderColor = 'var(--apex-primary-green)';
        input.style.backgroundColor = 'var(--apex-green-pale)';
        
        // Move to next input if current input is filled
        const inputs = document.querySelectorAll('.verification-input');
        if (index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    } else {
        input.style.borderColor = 'var(--apex-light-gray)';
        input.style.backgroundColor = 'var(--apex-white)';
    }
    
    // Check if all inputs are filled
    const allInputs = document.querySelectorAll('.verification-input');
    const allFilled = Array.from(allInputs).every(inp => inp.value.length === 1);
    
    if (allFilled) {
        // Add success animation
        allInputs.forEach(inp => {
            inp.style.borderColor = 'var(--apex-primary-green)';
            inp.style.backgroundColor = 'var(--apex-green-pale)';
        });
        
        setTimeout(() => {
            verifyEmail();
        }, 500);
    }
}

function handleVerificationKeydown(event, index) {
    // Handle backspace to go to previous input
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
        const inputs = document.querySelectorAll('.verification-input');
        if (inputs[index - 1]) {
            inputs[index - 1].focus();
            inputs[index - 1].value = '';
            inputs[index - 1].style.borderColor = 'var(--apex-light-gray)';
            inputs[index - 1].style.backgroundColor = 'var(--apex-white)';
        }
    }
    
    // Handle arrow keys for navigation
    if (event.key === 'ArrowLeft' && index > 0) {
        const inputs = document.querySelectorAll('.verification-input');
        inputs[index - 1].focus();
    }
    
    if (event.key === 'ArrowRight' && index < 5) {
        const inputs = document.querySelectorAll('.verification-input');
        inputs[index + 1].focus();
    }
}

function verifyEmail() {
    const inputs = document.querySelectorAll('.verification-input');
    const enteredCode = Array.from(inputs).map(input => input.value).join('');
    
    // Add loading state
    const verifyButton = document.querySelector('button[onclick="verifyEmail()"]');
    if (verifyButton) {
        verifyButton.disabled = true;
        verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    }
    
    setTimeout(() => {
        if (enteredCode === apexState.verificationCode) {
            // Verification successful - add success animation
            inputs.forEach(inp => {
                inp.style.borderColor = 'var(--apex-success)';
                inp.style.backgroundColor = 'var(--apex-green-pale)';
            });
            
            const user = apexState.pendingVerification;
            user.isVerified = true;
            user.loginTime = new Date().toISOString();
            
            // Set up user's account with $20 million and transactions
            console.log('Setting up new user account with $20 million...');
            
            // Save account data to localStorage
            localStorage.setItem('apexTransactions', JSON.stringify(user.transactions));
            localStorage.setItem('apexSpendingBalance', user.accountData.spending.balance.toString());
            localStorage.setItem('apexSavingsBalance', user.accountData.savings.balance.toString());
            
            // Update app state
            apexState.transactions = user.transactions;
            apexState.balance = user.accountData.spending.balance;
            apexState.savingsBalance = user.accountData.savings.balance;
            
            // Add user to database
            apexState.users.push(user);
            saveUsers();
            
            // Create user session
            apexState.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: apexState.pendingVerification.phone,
                accountNumber: apexState.pendingVerification.accountNumber,
                avatar: `https://picsum.photos/seed/${apexState.pendingVerification.email}/80/80.jpg`,
            };
            
            // Save session
            sessionStorage.setItem('apexSession', JSON.stringify(apexState.currentUser));
            
            // Show success message
            chimeToast('Email verified! Welcome to APEX Bank!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        } else {
            // Verification failed - add error animation
            inputs.forEach(inp => {
                inp.style.borderColor = 'var(--apex-error)';
                inp.style.backgroundColor = 'rgba(245, 101, 101, 0.1)';
                inp.style.animation = 'shake 0.5s ease-in-out';
            });
            
            chimeToast('Invalid verification code. Please try again.', 'error');
            
            // Clear inputs after animation
            setTimeout(() => {
                inputs.forEach(input => {
                    input.value = '';
                    input.style.borderColor = 'var(--apex-light-gray)';
                    input.style.backgroundColor = 'var(--apex-white)';
                    input.style.animation = '';
                });
                
                // Focus first input
                if (inputs[0]) {
                    inputs[0].focus();
                }
            }, 500);
        }
        
        // Reset button state
        if (verifyButton) {
            verifyButton.disabled = false;
            verifyButton.innerHTML = 'Verify Email';
        }
    }, 1000); // Simulate verification delay
}

function resendVerification() {
    if (apexState.pendingVerification) {
        // Generate new verification code
        apexState.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Display new code
        displayVerificationCode(apexState.verificationCode);
        
        chimeToast('New verification code sent!', 'info');
        
        // Clear inputs
        const inputs = document.querySelectorAll('.verification-input');
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
    }
}

// User Management Functions
function loadUsers() {
    const savedUsers = localStorage.getItem('apexUsers');
    if (savedUsers) {
        apexState.users = JSON.parse(savedUsers);
    }
}

function saveUsers() {
    localStorage.setItem('apexUsers', JSON.stringify(apexState.users));
}

// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letter');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Number');
    
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    else feedback.push('Special character');
    
    return { strength, feedback };
}

function apexSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear session data
        sessionStorage.removeItem('apexSession');
        localStorage.removeItem('apexUser');
        
        // Reset user state
        apexState.currentUser = null;
        
        // Redirect to main page
        window.location.href = 'index.html';
        chimeToast('Signed out successfully', 'success');
    }
}

function checkExistingSession() {
    // Check sessionStorage first (current session)
    const sessionData = sessionStorage.getItem('apexSession');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        const sessionAge = Date.now() - new Date(session.loginTime).getTime();
        
        // Session valid for 24 hours
        if (sessionAge < 24 * 60 * 60 * 1000) {
            apexState.currentUser = session;
            
            // For Helena Malm, load her account data
            if (session.email === 'westcoat.madfish@gmail.com') {
                console.log('Loading Helena Malm account data from session...');
                
                // Load transactions from localStorage
                const transactions = localStorage.getItem('apexTransactions');
                if (transactions) {
                    apexState.transactions = JSON.parse(transactions);
                }
                
                // Load balances from localStorage
                const spendingBalance = localStorage.getItem('apexSpendingBalance');
                const savingsBalance = localStorage.getItem('apexSavingsBalance');
                
                if (spendingBalance) {
                    apexState.balance = parseFloat(spendingBalance);
                }
                if (savingsBalance) {
                    apexState.savingsBalance = parseFloat(savingsBalance);
                }
                
                console.log('Helena data loaded from session');
                console.log('Balance:', apexState.balance);
                console.log('Transactions:', apexState.transactions?.length || 0);
            }
            
            return true;
        }
    }
    
    // Check localStorage (remember me)
    const rememberMeData = localStorage.getItem('apexUser');
    if (rememberMeData) {
        const user = JSON.parse(rememberMeData);
        const emailInput = document.getElementById('loginEmail');
        const rememberCheckbox = document.getElementById('rememberMe');
        if (emailInput) emailInput.value = user.email;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
    
    return false;
}

// Screen Navigation Functions
function showHomeScreen() {
    showScreen('home');
}

function showAccountScreen() {
    showScreen('account');
}

function showGoalsScreen() {
    showScreen('goals');
}

function showMoveMoneyScreen() {
    showScreen('move');
}

function showCreditScreen() {
    showScreen('credit');
}

function showAnalyticsScreen() {
    showScreen('analytics');
}

function showSettingsScreen() {
    showScreen('settings');
}

function showHelpScreen() {
    showScreen('help');
}

function showNotificationsScreen() {
    showScreen('notifications');
}

function showProfileScreen() {
    showScreen('profile');
}

function showAllTransactions() {
    chimeToast('Transaction history coming soon!', 'info');
}

function showSignup() {
    chimeToast('Sign up feature coming soon!', 'info');
}

function showMoreMenu() {
    chimeToast('More menu coming soon!', 'info');
}

function showFAQ() {
    chimeToast('FAQ section coming soon!', 'info');
}

function showContactSupport() {
    chimeToast('Contact support coming soon!', 'info');
}

function showSecurityHelp() {
    chimeToast('Security help coming soon!', 'info');
}

function showTroubleshooting() {
    chimeToast('Troubleshooting coming soon!', 'info');
}

// Home Screen Functions
function initializeHomeScreen() {
    updateBalanceDisplay();
    loadRecentTransactions();
    updateUserName();
}

function updateBalanceDisplay() {
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
        animateValue(balanceElement, 0, apexState.balance, 1000);
    }
}

function updateUserName() {
    const userNameElement = document.getElementById('userName');
    const cardHolderElement = document.getElementById('cardHolder');
    
    if (apexState.currentUser) {
        // Update welcome message with first name
        if (userNameElement) {
            userNameElement.textContent = apexState.currentUser.name.split(' ')[0];
        }
        
        // Update card holder with full name in uppercase
        if (cardHolderElement) {
            cardHolderElement.textContent = apexState.currentUser.name.toUpperCase();
        }
    }
}

function updateProfileInfo() {
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    
    if (apexState.currentUser) {
        // Update profile name
        if (profileNameElement) {
            profileNameElement.textContent = apexState.currentUser.name;
        }
        
        // Update profile email
        if (profileEmailElement) {
            profileEmailElement.textContent = apexState.currentUser.email;
        }
    }
}

function loadRecentTransactions() {
    const transactionsList = document.getElementById('recentTransactions');
    if (!transactionsList) return;
    
    const recentTransactions = apexState.transactions.slice(0, 4);
    transactionsList.innerHTML = recentTransactions.map(transaction => `
        <div class="apex-transaction-item" onclick="viewTransactionDetails(${transaction.id})">
            <div class="apex-transaction-icon ${transaction.type}">
                <i class="fas ${transaction.icon}"></i>
            </div>
            <div class="apex-transaction-details">
                <div class="apex-transaction-title">${transaction.title}</div>
                <div class="apex-transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="apex-transaction-amount ${transaction.type}">
                ${transaction.type === 'expense' ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}
            </div>
        </div>
    `).join('');
}

function viewTransactionDetails(transactionId) {
    const transaction = apexState.transactions.find(t => t.id === transactionId);
    if (transaction) {
        chimeToast(`${transaction.title}: $${Math.abs(transaction.amount).toFixed(2)}`, 'info');
    }
}

// Goals Screen Functions
function initializeGoalsScreen() {
    loadGoals();
}

function loadGoals() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;
    
    goalsList.innerHTML = apexState.goals.map(goal => {
        const percentage = Math.round((goal.amount / goal.target) * 100);
        return `
        <div class="apex-goal" onclick="selectGoal(${goal.id})">
            <div class="apex-goal-icon">
                <i class="fas ${goal.icon}"></i>
            </div>
            <div class="apex-goal-name">${goal.name}</div>
            <div class="apex-goal-amount">$${goal.amount.toFixed(2)}</div>
            <div class="apex-goal-progress">
                <div class="apex-goal-progress-bar" style="width: ${percentage}%;"></div>
            </div>
            <div class="apex-goal-percentage">${percentage}% of $${goal.target.toFixed(0)} goal</div>
        </div>
    `;
    }).join('') + `
        <div class="apex-goal" style="border: 2px dashed var(--apex-medium-gray); background: transparent; cursor: pointer;" onclick="createNewGoal()">
            <div class="apex-goal-icon" style="background: var(--apex-light-gray);">
                <i class="fas fa-plus" style="color: var(--apex-medium-gray);"></i>
                <i class="fas fa-plus" style="color: var(--apex-medium-gray);"></i>
            </div>
            <div class="apex-goal-name" style="color: var(--apex-medium-gray);">Create new goal</div>
            <div class="apex-goal-amount" style="color: var(--apex-medium-gray);">$0.00</div>
            <div class="apex-goal-progress">
                <div class="apex-goal-progress-bar" style="width: 0%; background: var(--apex-medium-gray);"></div>
            </div>
            <div class="apex-goal-percentage" style="color: var(--apex-medium-gray);">0% saved</div>
        </div>
    `;
}

function selectGoal(goalId) {
    const goal = apexState.goals.find(g => g.id === goalId);
    if (goal) {
        const percentage = Math.round((goal.amount / goal.target) * 100);
        chimeToast(`${goal.name}: $${goal.amount.toFixed(2)} (${percentage}% of goal)`, 'info');
    }
}

function createNewGoal() {
    const goalName = prompt('Enter goal name:');
    const targetAmount = prompt('Enter target amount:');
    
    if (goalName && targetAmount && !isNaN(targetAmount)) {
        const newGoal = {
            id: Date.now(),
            name: goalName,
            amount: 0.00,
            target: parseFloat(targetAmount),
            icon: 'fa-piggy-bank',
            color: 'var(--apex-primary-green)'
        };
        
        apexState.goals.push(newGoal);
        loadGoals();
        chimeToast(`${goalName} goal created! Target: $${parseFloat(targetAmount).toFixed(2)}`, 'success');
    }
}

// Move Money Screen Functions
function initializeMoveScreen() {
    const amountInput = document.getElementById('paymentAmount');
    const amountDisplay = document.getElementById('paymentAmountDisplay');
    
    if (amountInput && amountDisplay) {
        amountInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            amountDisplay.textContent = value.toFixed(2);
        });
    }
}

function showPayFriends() {
    chimeToast('Pay friends feature coming soon!', 'info');
}

function showPayBills() {
    chimeToast('Pay bills feature coming soon!', 'info');
}

function showTransferBetween() {
    chimeToast('Transfer between accounts coming soon!', 'info');
}

function makePayment() {
    const recipientName = document.getElementById('recipientName')?.value.trim();
    const amount = parseFloat(document.getElementById('paymentAmount')?.value) || 0;
    const note = document.getElementById('paymentNote')?.value.trim();
    
    // Validation
    if (!recipientName) {
        chimeToast('Please enter a recipient', 'error');
        return;
    }
    
    if (amount <= 0) {
        chimeToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (amount > apexState.balance) {
        chimeToast('Insufficient funds', 'error');
        return;
    }
    
    // Process payment
    processPayment(recipientName, amount, note);
}

function processPayment(recipient, amount, note) {
    // Show loading state
    chimeToast('Processing payment...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // Update balance
        apexState.balance -= amount;
        
        // Add transaction
        const newTransaction = {
            id: apexState.transactions.length + 1,
            title: `Payment to ${recipient}`,
            amount: -amount,
            date: new Date(),
            category: 'transfer',
            type: 'expense',
            icon: 'fa-exchange-alt',
            note: note
        };
        
        apexState.transactions.unshift(newTransaction);
        
        // Show success message
        chimeToast(`Payment of $${amount.toFixed(2)} to ${recipient} completed!`, 'success');
        
        // Reset form and return to home
        document.getElementById('recipientName').value = '';
        document.getElementById('paymentAmount').value = '';
        document.getElementById('paymentNote').value = '';
        document.getElementById('paymentAmountDisplay').textContent = '0.00';
        
        showScreen('home');
    }, 2000);
}

// Credit Builder Screen Functions
function initializeCreditScreen() {
    // Credit builder screen is mostly static
}

function applyForCreditBuilder() {
    chimeToast('Credit Builder application submitted! We\'ll review your application within 24 hours.', 'success');
}

// Account Screen Functions
function initializeAccountScreen() {
    // Account screen is mostly static
}

// Analytics Screen Functions
function initializeAnalyticsScreen() {
    // Analytics screen is mostly static
}

// Settings Screen Functions
function initializeSettingsScreen() {
    // Settings screen is mostly static
}

// Help Screen Functions
function initializeHelpScreen() {
    // Help screen is mostly static
}

// Notifications Screen Functions
function initializeNotificationsScreen() {
    // Notifications screen is mostly static
}

// Profile Screen Functions
function initializeProfileScreen() {
    updateProfileInfo();
}

// Utility Functions
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const updateValue = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        element.textContent = '$' + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };
    requestAnimationFrame(updateValue);
}

function chimeToast(message, type = 'success') {
    const toast = document.getElementById('chimeToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        // Update toast content
        toastMessage.textContent = message;
        
        // Update toast type
        toast.className = 'apex-toast show ' + type;
        
        // Update icon
        const icon = toast.querySelector('i');
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        } else if (type === 'info') {
            icon.className = 'fas fa-info-circle';
        }
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    if (e.key === 'Escape') {
        // Go back to home if not already there
        if (currentPage !== 'home' && currentPage !== 'login') {
            window.location.href = 'home.html';
        }
    }
    
    // Enter key for login
    if (e.key === 'Enter' && currentPage === 'login') {
        apexLogin();
    }
});

// Goal Management Functions
function createNewGoal() {
    const goalName = prompt('Enter goal name:');
    if (!goalName || goalName.trim() === '') {
        chimeToast('Please enter a valid goal name', 'error');
        return;
    }
    
    const goalAmount = prompt('Enter target amount:');
    if (!goalAmount || isNaN(goalAmount) || parseFloat(goalAmount) <= 0) {
        chimeToast('Please enter a valid target amount', 'error');
        return;
    }
    
    const icons = ['fa-home', 'fa-plane', 'fa-laptop', 'fa-gift', 'fa-car', 'fa-graduation-cap', 'fa-ring', 'fa-heart', 'fa-umbrella-beach', 'fa-shopping-bag'];
    const colors = ['var(--apex-primary-green)', 'var(--apex-info)', 'var(--apex-warning)', 'var(--apex-error)', 'var(--apex-primary-teal)'];
    
    const newGoal = {
        id: Date.now(),
        name: goalName.trim(),
        amount: 0.00,
        target: parseFloat(goalAmount),
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    apexState.goals.push(newGoal);
    saveGoals();
    renderGoals();
    chimeToast(`Goal "${newGoal.name}" created successfully!`, 'success');
}

function deleteGoal(goalId) {
    const goal = apexState.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    if (confirm(`Are you sure you want to delete the goal "${goal.name}"? This action cannot be undone.`)) {
        apexState.goals = apexState.goals.filter(g => g.id !== goalId);
        saveGoals();
        renderGoals();
        chimeToast(`Goal "${goal.name}" deleted successfully`, 'success');
    }
}

function saveGoals() {
    localStorage.setItem('apexGoals', JSON.stringify(apexState.goals));
}

function loadGoals() {
    const savedGoals = localStorage.getItem('apexGoals');
    if (savedGoals) {
        apexState.goals = JSON.parse(savedGoals);
    }
}

function renderGoals() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;
    
    // Clear existing goals except the "Create new goal" button
    const existingGoals = goalsList.querySelectorAll('.apex-goal:not([onclick*="createNewGoal"])');
    existingGoals.forEach(goal => goal.remove());
    
    // Render each goal
    apexState.goals.forEach(goal => {
        const percentage = goal.target > 0 ? (goal.amount / goal.target * 100) : 0;
        const goalElement = document.createElement('div');
        goalElement.className = 'apex-goal';
        goalElement.innerHTML = `
            <div class="apex-goal-icon" style="background: ${goal.color};">
                <i class="fas ${goal.icon}"></i>
            </div>
            <h3 class="apex-goal-name">${goal.name}</h3>
            <div class="apex-goal-amount">$${goal.amount.toFixed(2)}</div>
            <div class="apex-goal-progress">
                <div class="apex-goal-progress-bar" style="width: ${percentage}%;"></div>
            </div>
            <div class="apex-goal-percentage">${percentage.toFixed(0)}% of $${goal.target.toFixed(2)} goal</div>
            <button class="apex-goal-delete" onclick="deleteGoal(${goal.id})" aria-label="Delete goal">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Insert before the "Create new goal" button
        const createButton = goalsList.querySelector('[onclick*="createNewGoal"]');
        if (createButton) {
            goalsList.insertBefore(goalElement, createButton);
        } else {
            goalsList.appendChild(goalElement);
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Auto-setup Helena Malm account for demo
    setupHelenaMalmAccount();
    
    // Check for existing session first
    const hasSession = checkExistingSession();
    
    // Only redirect to login if no session and not on public pages
    if (!hasSession) {
        if (currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'index') {
            window.location.href = 'login.html';
            return;
        }
    }
    
    // Initialize page-specific content
    if (currentPage === 'home') {
        initializeHome();
    } else if (currentPage === 'login') {
        setupHelenaMalmAccount(); // Ensure Helena account exists for login
    } else if (currentPage === 'account') {
        initializeAccount();
    } else if (currentPage === 'goals') {
        initializeGoals();
    } else if (currentPage === 'move') {
        initializeMove();
    } else if (currentPage === 'analytics') {
        initializeAnalytics();
    } else if (currentPage === 'settings') {
        initializeSettings();
    } else if (currentPage === 'help') {
        initializeHelp();
    } else if (currentPage === 'notifications') {
        initializeNotifications();
    } else if (currentPage === 'credit') {
        initializeCredit();
    } else if (currentPage === 'deposit') {
        initializeDeposit();
    }
    // Add input animations
    document.querySelectorAll('.apex-input').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.apex-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Signup Screen Functions
function initializeSignupScreen() {
    // Add password strength checker
    const passwordInput = document.getElementById('signupPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const { strength, feedback } = checkPasswordStrength(password);
            
            let strengthText = '';
            let strengthColor = '';
            
            if (password.length === 0) {
                strengthText = '';
                strengthColor = 'var(--chime-medium-gray)';
            } else if (strength <= 2) {
                strengthText = 'Weak';
                strengthColor = 'var(--chime-error)';
            } else if (strength <= 3) {
                strengthText = 'Fair';
                strengthColor = 'var(--chime-warning)';
            } else if (strength <= 4) {
                strengthText = 'Good';
                strengthColor = 'var(--chime-info)';
            } else {
                strengthText = 'Strong';
                strengthColor = 'var(--chime-success)';
            }
            
            strengthIndicator.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--chime-spacing-2); margin-bottom: var(--chime-spacing-1);">
                    <span style="font-size: var(--chime-font-size-sm); color: ${strengthColor}; font-weight: 600;">Password Strength: ${strengthText}</span>
                </div>
                <div style="display: flex; gap: 2px;">
                    ${Array(5).fill(0).map((_, i) => 
                        `<div style="width: 8px; height: 4px; background: ${i < strength ? strengthColor : 'var(--chime-light-gray)'}; border-radius: 2px;"></div>`
                    ).join('')}
                </div>
                ${feedback.length > 0 && password.length > 0 ? 
                    `<div style="font-size: var(--chime-font-size-xs); color: var(--chime-medium-gray); margin-top: var(--chime-spacing-1);">
                        Add: ${feedback.join(', ')}
                    </div>` : ''
                }
            `;
        });
    }
}

// Export functions for global access
window.showScreen = showScreen;
window.showHomeScreen = showHomeScreen;
window.showAccountScreen = showAccountScreen;
window.showGoalsScreen = showGoalsScreen;
window.showMoveMoneyScreen = showMoveMoneyScreen;
window.showCreditScreen = showCreditScreen;
window.showAnalyticsScreen = showAnalyticsScreen;
window.showSettingsScreen = showSettingsScreen;
window.showHelpScreen = showHelpScreen;
window.showNotificationsScreen = showNotificationsScreen;
window.showProfileScreen = showProfileScreen;
window.showAllTransactions = showAllTransactions;
window.showSignup = showSignup;
window.apexLogin = apexLogin;
window.apexSignOut = apexSignOut;
window.createAccount = createAccount;
window.verifyEmail = verifyEmail;
window.resendVerification = resendVerification;
window.handleVerificationInput = handleVerificationInput;

// Helena Malm Account Setup - Fresh Database
function setupHelenaMalmAccount() {
    // Clear all existing data
    console.log('Clearing existing database...');
    
    // Clear localStorage completely
    localStorage.clear();
    
    // Reset app state
    apexState.users = [];
    apexState.transactions = [];
    apexState.goals = [];
    apexState.currentUser = null;
    apexState.balance = 0;
    apexState.savingsBalance = 0;
    
    // Create Helena Malm's user account
    const helenaAccount = {
        id: Date.now(),
        firstName: 'Helena',
        lastName: 'Malm',
        name: 'Helena Malm',
        email: 'westcoat.madfish@gmail.com',
        phone: '+1-555-0123-4567',
        accountNumber: '45284731',
        avatar: 'https://picsum.photos/seed/helena-malm/80/80.jpg',
        createdAt: new Date('2024-01-15'),
        isVerified: true
    };

    // Set up account balances (total $20 million)
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
            name: 'Private Jet Charter - Monaco',
            amount: -45000.00,
            date: new Date('2024-12-20'),
            type: 'payment',
            category: 'Travel',
            description: 'Round trip private jet charter'
        },
        {
            id: 1007,
            name: 'Art Auction - Sotheby\'s',
            amount: -1200000.00,
            date: new Date('2024-11-10'),
            type: 'payment',
            category: 'Art',
            description: 'Contemporary art piece acquisition'
        },
        {
            id: 1008,
            name: 'Hotel du Cap-Eden-Roc',
            amount: -18000.00,
            date: new Date('2024-12-18'),
            type: 'payment',
            category: 'Travel',
            description: '5-night luxury suite accommodation'
        },
        {
            id: 1009,
            name: 'Financial Advisory - Goldman Sachs',
            amount: -125000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Professional',
            description: 'Wealth management quarterly fee'
        },
        {
            id: 1010,
            name: 'Cryptocurrency Purchase - Bitcoin',
            amount: -500000.00,
            date: new Date('2024-12-15'),
            type: 'payment',
            category: 'Investment',
            description: 'Digital asset investment'
        },
        {
            id: 1011,
            name: 'Tesla Model S Plaid',
            amount: -135000.00,
            date: new Date('2024-12-22'),
            type: 'payment',
            category: 'Automotive',
            description: 'Electric vehicle purchase'
        },
        {
            id: 1012,
            name: 'Charitable Donation - Red Cross',
            amount: -100000.00,
            date: new Date('2024-12-21'),
            type: 'payment',
            category: 'Charity',
            description: 'Year-end charitable contribution'
        },
        {
            id: 1013,
            name: 'Rolex Daytona Watch',
            amount: -28500.00,
            date: new Date('2024-12-05'),
            type: 'payment',
            category: 'Luxury',
            description: 'Luxury timepiece purchase'
        },
        {
            id: 1014,
            name: 'Hermès Birkin Bag',
            amount: -12000.00,
            date: new Date('2024-11-28'),
            type: 'payment',
            category: 'Fashion',
            description: 'Designer handbag purchase'
        },
        {
            id: 1015,
            name: 'Penthouse Maintenance',
            amount: -15000.00,
            date: new Date('2024-12-01'),
            type: 'payment',
            category: 'Property',
            description: 'Monthly building maintenance fee'
        }
    ];

    // Sort transactions by date (most recent first)
    realisticTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create Helena user for login
    const helenaUser = {
        id: helenaAccount.id,
        firstName: 'Helena',
        lastName: 'Malm',
        name: 'Helena Malm',
        email: 'westcoat.madfish@gmail.com',
        phone: '+1-555-0123-4567',
        accountNumber: '45284731',
        password: 'Helena123!',
        avatar: 'https://picsum.photos/seed/helena-malm/80/80.jpg',
        createdAt: new Date('2024-01-15'),
        isVerified: true
    };
    
    // Set users database with only Helena
    apexState.users = [helenaUser];
    saveUsers();
    
    console.log('Fresh database created with Helena Malm account');
    console.log('Email:', helenaUser.email);
    console.log('Password:', helenaUser.password);
    
    // Save to localStorage
    localStorage.setItem('apexCurrentUser', JSON.stringify(helenaAccount));
    localStorage.setItem('apexSession', JSON.stringify(helenaAccount));
    localStorage.setItem('apexTransactions', JSON.stringify(realisticTransactions));
    localStorage.setItem('apexSpendingBalance', accountData.spending.balance.toString());
    localStorage.setItem('apexSavingsBalance', accountData.savings.balance.toString());
    
    // Update app state
    apexState.currentUser = helenaAccount;
    apexState.transactions = realisticTransactions;
    apexState.balance = accountData.spending.balance;
    apexState.savingsBalance = accountData.savings.balance;

    console.log('Helena Malm account created successfully!');
    console.log('Account Balance: $20,000,000.00');
    console.log('Transactions: ' + realisticTransactions.length + ' realistic transactions added');
    
    return {
        account: helenaAccount,
        transactions: realisticTransactions,
        balances: accountData
    };
}

window.setupHelenaMalmAccount = setupHelenaMalmAccount;
window.handleVerificationKeydown = handleVerificationKeydown;
window.makePayment = makePayment;
window.createNewGoal = createNewGoal;
window.selectGoal = selectGoal;
window.viewTransactionDetails = viewTransactionDetails;
window.showPayFriends = showPayFriends;
window.showPayBills = showPayBills;
window.showTransferBetween = showTransferBetween;
window.applyForCreditBuilder = applyForCreditBuilder;
window.showMoreMenu = showMoreMenu;
window.showFAQ = showFAQ;
window.showContactSupport = showContactSupport;
window.showSecurityHelp = showSecurityHelp;
window.showTroubleshooting = showTroubleshooting;
window.apexSignOut = apexSignOut;
window.apexLogin = apexLogin;
window.createAccount = createAccount;
window.verifyEmail = verifyEmail;
window.resendVerification = resendVerification;
window.handleVerificationInput = handleVerificationInput;
