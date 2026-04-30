// APEX Bank - Fixed JavaScript File
// This file contains the essential functions to fix the syntax errors

// Simple test function to verify JavaScript is working
function testJS() {
    console.log('JavaScript is working!');
}

// Provide a lightweight global state object for pages that still reference it.
// (The main logic in this repo uses localStorage/sessionStorage as the source of truth.)
window.apexState = window.apexState || {
    get currentUser() {
        return getCurrentUser();
    }
};

const PRIMARY_ACCOUNT = Object.freeze({
    email: 'westcoat.madfish@gmail.com',
    phone: '0544022365',
    password: 'Aaddffgghh1$',
    firstName: 'Helena',
    lastName: 'Malm',
    name: 'Helena Malm',
    accountNumber: '45284731',
    balance: 37310983.00
});

function showApexToast(message, type = 'info') {
    const toast = document.getElementById('chimeToast') || document.getElementById('apexToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) {
        alert(message);
        return;
    }
    
    toastMessage.textContent = message;
    toast.classList.remove('show', 'success', 'error', 'warning', 'info');
    toast.classList.add(type);
    void toast.offsetWidth;
    toast.classList.add('show');
    
    if (window.apexToastTimer) {
        clearTimeout(window.apexToastTimer);
    }
    
    window.apexToastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

// Backwards-compatible alias used across pages.
function chimeToast(message, type = 'info') {
    showApexToast(message, type);
}

function formatAccountNumber(accountNumber) {
    const digits = (accountNumber || '').toString().replace(/\D/g, '');
    if (digits.length < 4) return '**** **** **** 8234';
    const lastFour = digits.slice(-4);
    return `**** **** **** ${lastFour}`;
}

function showAllTransactions() {
    window.location.href = 'account.html';
}

function showMoreMenu() {
    const currentPath = (window.location.pathname.split('/').pop() || 'home.html').toLowerCase();
    const currentUser = getCurrentUser();
    const isLoggedIn = Boolean(currentUser.email);
    const menuItems = isLoggedIn
        ? [
            { href: 'settings.html', icon: 'fa-cog', label: 'Settings' },
            { href: 'help.html', icon: 'fa-question-circle', label: 'Help' },
            { href: 'notifications.html', icon: 'fa-bell', label: 'Notifications' },
            { href: 'profile.html', icon: 'fa-user', label: 'Profile' }
        ]
        : [
            { href: 'login.html', icon: 'fa-sign-in-alt', label: 'Sign In' },
            { href: 'signup.html', icon: 'fa-user-plus', label: 'Sign Up' },
            { href: 'help.html', icon: 'fa-question-circle', label: 'Help' }
        ];

    let overlay = document.getElementById('apexMobileMoreOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'apexMobileMoreOverlay';
        overlay.className = 'apex-mobile-more-overlay';
        overlay.innerHTML = `
            <div class="apex-mobile-more-sheet" role="dialog" aria-modal="true" aria-label="More navigation">
                <div class="apex-mobile-more-header">
                    <span>More</span>
                    <button type="button" class="apex-mobile-more-close" aria-label="Close more menu">&times;</button>
                </div>
                <div class="apex-mobile-more-list"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', event => {
            const sheet = overlay.querySelector('.apex-mobile-more-sheet');
            if (sheet && !sheet.contains(event.target)) {
                closeMoreMenu();
            }
        });

        const closeButton = overlay.querySelector('.apex-mobile-more-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeMoreMenu);
        }
    }

    const list = overlay.querySelector('.apex-mobile-more-list');
    if (!list) return;

    list.innerHTML = menuItems.map(item => {
        const activeClass = item.href.toLowerCase() === currentPath ? 'active' : '';
        return `
            <a href="${item.href}" class="apex-mobile-more-link ${activeClass}">
                <i class="fas ${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `;
    }).join('') + (isLoggedIn
        ? `
            <button type="button" class="apex-mobile-more-link apex-mobile-more-logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        `
        : '');

    const logoutButton = list.querySelector('.apex-mobile-more-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            closeMoreMenu();
            logout('login.html');
        });
    }

    list.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', () => {
            closeMoreMenu();
        });
    });

    overlay.classList.add('show');
    document.body.classList.add('apex-mobile-more-open');
}

function closeMoreMenu() {
    const overlay = document.getElementById('apexMobileMoreOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
    document.body.classList.remove('apex-mobile-more-open');
}

function normalizeEmail(value) {
    return (value || '').trim().toLowerCase();
}

function normalizePhone(value) {
    return (value || '').replace(/\D/g, '');
}

function normalizeLoginIdentifier(value) {
    const trimmedValue = (value || '').trim();
    return trimmedValue.includes('@') ? normalizeEmail(trimmedValue) : normalizePhone(trimmedValue);
}

function getCurrentUser() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('apexCurrentUser') || '{}');
        return currentUser && typeof currentUser === 'object' ? currentUser : {};
    } catch (error) {
        return {};
    }
}

function getSecondaryUsers() {
    try {
        const secondaryUsers = JSON.parse(localStorage.getItem('apexSecondaryUsers') || '[]');
        return Array.isArray(secondaryUsers) ? secondaryUsers : [];
    } catch (error) {
        return [];
    }
}

function saveSecondaryUsers(secondaryUsers) {
    localStorage.setItem('apexSecondaryUsers', JSON.stringify(secondaryUsers));
}

function generateAccountNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function isPrimaryUserIdentifier(identifier) {
    const normalizedIdentifier = normalizeLoginIdentifier(identifier);
    return normalizedIdentifier === PRIMARY_ACCOUNT.email || normalizedIdentifier === normalizePhone(PRIMARY_ACCOUNT.phone);
}

function findSecondaryUserByIdentifier(identifier) {
    const normalizedIdentifier = normalizeLoginIdentifier(identifier);
    
    return getSecondaryUsers().find(user => {
        return normalizeEmail(user.email) === normalizedIdentifier || normalizePhone(user.phone) === normalizedIdentifier;
    });
}

function createUserSession(user) {
    const firstName = (user.firstName || '').trim() || (user.name || 'User').trim().split(' ')[0];
    const lastName = (user.lastName || '').trim();
    const name = (user.name || `${firstName} ${lastName}`.trim()).trim();
    const email = normalizeEmail(user.email);
    const phone = normalizePhone(user.phone);
    const avatarSeed = email || phone || Date.now().toString();
    
    return {
        id: Date.now(),
        name: name || 'User',
        firstName: firstName || 'User',
        lastName: lastName,
        email: email,
        phone: phone,
        accountNumber: user.accountNumber || generateAccountNumber(),
        balance: typeof user.balance === 'number' ? user.balance : 0.00,
        avatar: user.avatar || `https://picsum.photos/seed/${avatarSeed}/80/80.jpg`,
        loginTime: new Date().toISOString()
    };
}

function persistUserSession(userSession) {
    sessionStorage.setItem('apexSession', JSON.stringify(userSession));
    localStorage.setItem('apexCurrentUser', JSON.stringify(userSession));
}

function resetVerificationInputs() {
    const verificationInputs = document.querySelectorAll('.verification-input');
    
    verificationInputs.forEach((input, index) => {
        input.value = '';
        input.style.borderColor = 'var(--apex-light-gray)';
        input.style.backgroundColor = 'var(--apex-white)';
        
        if (index === 0) {
            input.focus();
        }
    });
}

function showVerificationScreen(verificationCode) {
    const verificationScreen = document.getElementById('verification-screen');
    const signupScreen = document.getElementById('signup-screen');
    const codeValue = document.getElementById('codeValue');
    
    if (!verificationScreen || !signupScreen || !codeValue) {
        return false;
    }
    
    signupScreen.style.display = 'none';
    verificationScreen.style.display = 'flex';
    codeValue.textContent = verificationCode;
    codeValue.style.animation = 'pulse 2s infinite';
    resetVerificationInputs();
    
    return true;
}

// Check login status and update More button menu
function updateMoreButtonMenu() {
    const currentUser = JSON.parse(localStorage.getItem('apexCurrentUser') || '{}');
    const moreMenu = document.getElementById('moreMenu');
    
    if (moreMenu && currentUser.email) {
        // User is logged in, hide Sign In and Sign Up links
        const links = moreMenu.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === 'login.html' || href === 'signup.html') {
                link.style.display = 'none';
            }
        });
        
        // Add Logout option if not already present
        if (!moreMenu.querySelector('a[href="javascript:logout()"]')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = 'javascript:logout()';
            logoutLink.textContent = 'Logout';
            logoutLink.style.cssText = 'display: block; padding: 12px 16px; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; background: rgba(220, 53, 69, 0.2);';
            logoutLink.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(220, 53, 69, 0.3)';
            });
            logoutLink.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(220, 53, 69, 0.2)';
            });
            moreMenu.appendChild(logoutLink);
        }
    }
}

// Logout function
function logout(redirectTo = 'login.html') {
    // Clear user session
    sessionStorage.removeItem('apexSession');
    localStorage.removeItem('apexCurrentUser');
    localStorage.removeItem('apexRememberMe');
    localStorage.removeItem('apexSpendingBalance');
    localStorage.removeItem('apexSavingsBalance');
    localStorage.removeItem('apexTransactions');
    window.pendingUser = null;
    window.generatedVerificationCode = null;
    
    // Update navigation visibility for logged-out user
    updateNavigationVisibility();
    
    // Show logout message
    showApexToast('You have been logged out successfully.', 'info');
    
    // Redirect after toast feedback
    setTimeout(() => {
        window.location.href = redirectTo;
    }, 250);
}

// Update account numbers dynamically
function updateAccountNumbers() {
    const currentUser = JSON.parse(localStorage.getItem('apexCurrentUser') || '{}');
    
    if (currentUser.accountNumber) {
        // Update card number display (masked format)
        const cardNumberElement = document.getElementById('cardNumber');
        if (cardNumberElement) {
            const lastFour = currentUser.accountNumber.slice(-4);
            cardNumberElement.textContent = `**** **** **** ${lastFour}`;
        }
        
        // Update account ending display
        const accountEndingElement = document.getElementById('accountEnding');
        if (accountEndingElement) {
            const lastFour = currentUser.accountNumber.slice(-4);
            accountEndingElement.textContent = `Account ending in ${lastFour}`;
        }
        
        // Update any other account number displays
        const accountNumberElements = document.querySelectorAll('[data-account-number]');
        accountNumberElements.forEach(element => {
            const lastFour = currentUser.accountNumber.slice(-4);
            element.textContent = `**** **** **** ${lastFour}`;
        });
    }
}

// Auto-update More button on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check login status and redirect if needed
    if (!checkLoginStatus()) {
        return; // Will redirect, so don't continue
    }
    
    initializeSignupScreen();
    
    // Update navigation visibility based on login status
    updateNavigationVisibility();
    
    // Update More button menu and account numbers if logged in
    const currentUser = JSON.parse(localStorage.getItem('apexCurrentUser') || '{}');
    if (currentUser.email) {
        updateMoreButtonMenu();
        updateAccountNumbers();
        
        // If user is logged in and on signup page, update the UI to show they're creating an additional account
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'signup.html') {
            const authTitle = document.querySelector('.apex-auth-title');
            const authSubtitle = document.querySelector('.apex-auth-subtitle');
            if (authTitle) authTitle.textContent = 'Create Additional Account';
            if (authSubtitle) authSubtitle.textContent = 'Add up to 4 additional accounts to your APEX Bank profile';
        }
    }
});

// Fixed Login Function
function apexLogin() {
    const identifier = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    const authCard = document.querySelector('.apex-auth-card');
    
    if (!identifier || !password) {
        showApexToast('Please enter your email or phone number and password.', 'error');
        if (authCard) {
            authCard.classList.add('shake');
            setTimeout(() => authCard.classList.remove('shake'), 500);
        }
        return;
    }
    
    const normalizedIdentifier = normalizeLoginIdentifier(identifier);
    let userSession = null;
    
    if (isPrimaryUserIdentifier(normalizedIdentifier)) {
        if (password !== PRIMARY_ACCOUNT.password) {
            showApexToast('Invalid password. Please try again.', 'error');
            if (authCard) {
                authCard.classList.add('shake');
                setTimeout(() => authCard.classList.remove('shake'), 500);
            }
            return;
        }
        
        userSession = createUserSession({
            ...PRIMARY_ACCOUNT,
            avatar: `https://picsum.photos/seed/${PRIMARY_ACCOUNT.email}/80/80.jpg`
        });
    } else {
        const secondaryUser = findSecondaryUserByIdentifier(normalizedIdentifier);
        if (!secondaryUser) {
            showApexToast('No account matched that email or phone number.', 'error');
            if (authCard) {
                authCard.classList.add('shake');
                setTimeout(() => authCard.classList.remove('shake'), 500);
            }
            return;
        }
        
        if (password !== secondaryUser.password) {
            showApexToast('Invalid password. Please try again.', 'error');
            if (authCard) {
                authCard.classList.add('shake');
                setTimeout(() => authCard.classList.remove('shake'), 500);
            }
            return;
        }
        
        userSession = createUserSession({
            ...secondaryUser,
            balance: 0.00
        });
    }
    
    try {
        sessionStorage.removeItem('apexSession');
        localStorage.removeItem('apexCurrentUser');
        persistUserSession(userSession);
        localStorage.setItem('apexRememberMe', rememberMe ? 'true' : 'false');
        
        updateMoreButtonMenu();
        updateAccountNumbers();
        updateNavigationVisibility();
        setupUniversalAccount();
        showApexToast('Login successful! Welcome to APEX Bank.', 'success');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 350);
    } catch (error) {
        console.error('Error during login process:', error);
        showApexToast('An error occurred during login. Please try again.', 'error');
    }
}

// Fixed Create Account Function
function createAccount() {
    const firstName = document.getElementById('signupFirstName')?.value.trim();
    const lastName = document.getElementById('signupLastName')?.value.trim();
    const email = normalizeEmail(document.getElementById('signupEmail')?.value);
    const phone = normalizePhone(document.getElementById('signupPhone')?.value);
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked === true;
    const secondaryUsers = getSecondaryUsers();
    const authCard = document.querySelector('.apex-auth-card');
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showApexToast('Please fill in all fields.', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showApexToast('Please enter a valid email address.', 'error');
        return;
    }
    
    if (phone.length < 7) {
        showApexToast('Please enter a valid phone number.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showApexToast('Password must be at least 8 characters long.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showApexToast('Passwords do not match.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showApexToast('Please agree to the Terms of Service and Privacy Policy.', 'error');
        return;
    }
    
    if (secondaryUsers.length >= 4) {
        showApexToast('Maximum account limit reached. Only 4 additional accounts are allowed.', 'warning');
        return;
    }
    
    if (
        isPrimaryUserIdentifier(email) ||
        isPrimaryUserIdentifier(phone) ||
        findSecondaryUserByIdentifier(email) ||
        findSecondaryUserByIdentifier(phone)
    ) {
        showApexToast('An account with that email or phone number already exists.', 'error');
        return;
    }
    
    window.pendingUser = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        password: password,
        accountNumber: generateAccountNumber(),
        createdAt: new Date().toISOString()
    };
    
    window.generatedVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (!showVerificationScreen(window.generatedVerificationCode)) {
        showApexToast('Unable to load the verification step. Please refresh and try again.', 'error');
        if (authCard) {
            authCard.classList.add('shake');
            setTimeout(() => authCard.classList.remove('shake'), 500);
        }
        return;
    }
    
    showApexToast('Enter the 6-digit code below to finish creating your account.', 'info');
}

// Fixed Sign Out Function
function apexSignOut() {
    if (!confirm('Are you sure you want to sign out?')) {
        return;
    }
    console.log('Signing out...');
    logout('index.html');
}

// Handle Verification Input
function handleVerificationInput(input, index) {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    
    if (input.value.length === 1 && index < 5) {
        // Move to next input
        const nextInput = document.querySelectorAll('.verification-input')[index + 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
    
    // Check if all inputs are filled
    const inputs = document.querySelectorAll('.verification-input');
    const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
    
    if (allFilled) {
        // Auto-submit verification
        verifyEmail();
    }
}

// Handle Verification Keydown
function handleVerificationKeydown(event, index) {
    console.log('handleVerificationKeydown called for input ' + index);
    
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
        // Move to previous input
        const prevInput = document.querySelectorAll('.verification-input')[index - 1];
        if (prevInput) {
            prevInput.focus();
        }
    }
    
    // Allow only numbers
    if (event.key && !/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab' && event.key !== 'Enter') {
        event.preventDefault();
    }
}

// Verify Email Function
function verifyEmail() {
    const inputs = document.querySelectorAll('.verification-input');
    const enteredCode = Array.from(inputs).map(input => input.value).join('');
    const storedCode = window.generatedVerificationCode;
    const pendingUser = window.pendingUser;
    
    if (!pendingUser || !storedCode) {
        showApexToast('Please complete the sign-up form before verifying.', 'error');
        return;
    }
    
    if (enteredCode.length !== 6) {
        showApexToast('Please enter the full 6-digit verification code.', 'error');
        return;
    }
    
    if (enteredCode !== storedCode) {
        resetVerificationInputs();
        showApexToast('Invalid verification code. Please try again.', 'error');
        return;
    }
    
    const secondaryUsers = getSecondaryUsers();
    if (secondaryUsers.length >= 4) {
        showApexToast('Maximum account limit reached. Only 4 additional accounts are allowed.', 'warning');
        return;
    }
    
    if (
        isPrimaryUserIdentifier(pendingUser.email) ||
        isPrimaryUserIdentifier(pendingUser.phone) ||
        findSecondaryUserByIdentifier(pendingUser.email) ||
        findSecondaryUserByIdentifier(pendingUser.phone)
    ) {
        window.pendingUser = null;
        window.generatedVerificationCode = null;
        showApexToast('That account already exists. Please sign in instead.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 400);
        return;
    }
    
    const secondaryUser = {
        ...pendingUser
    };
    
    secondaryUsers.push(secondaryUser);
    saveSecondaryUsers(secondaryUsers);
    
    const currentUser = getCurrentUser();
    window.pendingUser = null;
    window.generatedVerificationCode = null;
    
    if (currentUser.email) {
        showApexToast('Additional account created successfully.', 'success');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 400);
        return;
    }
    
    try {
        const userSession = createUserSession({
            ...secondaryUser,
            balance: 0.00
        });
        
        persistUserSession(userSession);
        updateMoreButtonMenu();
        updateAccountNumbers();
        updateNavigationVisibility();
        setupUniversalAccount();
        
        showApexToast('Email verified! Your account is ready.', 'success');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 400);
    } catch (error) {
        console.error('Account created but auto-login failed:', error);
        showApexToast('Your account was created. Please sign in to continue.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 400);
    }
}

function resendVerification() {
    if (!window.pendingUser) {
        showApexToast('Please fill in the sign-up form first.', 'warning');
        return;
    }
    
    window.generatedVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const codeValue = document.getElementById('codeValue');
    if (codeValue) {
        codeValue.textContent = window.generatedVerificationCode;
    }
    
    resetVerificationInputs();
    showApexToast('A new verification code is ready.', 'info');
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

function initializeSignupScreen() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('signupPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!signupForm) {
        return;
    }
    
    if (signupForm.dataset.initialized !== 'true') {
        signupForm.dataset.initialized = 'true';
        signupForm.addEventListener('submit', event => {
            event.preventDefault();
            createAccount();
        });
    }
    
    if (passwordInput && strengthIndicator && passwordInput.dataset.initialized !== 'true') {
        passwordInput.dataset.initialized = 'true';
        
        const updateStrengthIndicator = () => {
            const password = passwordInput.value;
            
            if (!password) {
                strengthIndicator.innerHTML = '';
                return;
            }
            
            const strength = checkPasswordStrength(password);
            let label = 'Weak';
            let color = 'var(--apex-error)';
            
            if (strength >= 5) {
                label = 'Strong';
                color = 'var(--apex-success)';
            } else if (strength >= 4) {
                label = 'Good';
                color = 'var(--apex-info)';
            } else if (strength >= 3) {
                label = 'Fair';
                color = 'var(--apex-warning)';
            }
            
            strengthIndicator.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--apex-spacing-2); margin-top: var(--apex-spacing-2);">
                    <span style="font-size: var(--apex-font-size-sm); color: ${color}; font-weight: 600;">Password strength: ${label}</span>
                    <span style="font-size: var(--apex-font-size-xs); color: var(--apex-medium-gray);">Use upper, lower, number, and symbol</span>
                </div>
                <div style="display: flex; gap: 4px; margin-top: 6px;">
                    ${Array.from({ length: 5 }, (_, index) => `<span style="flex: 1; height: 4px; border-radius: var(--apex-radius-full); background: ${index < strength ? color : 'var(--apex-light-gray)'};"></span>`).join('')}
                </div>
            `;
        };
        
        passwordInput.addEventListener('input', updateStrengthIndicator);
        updateStrengthIndicator();
    }
}

// Additional utility functions for banking features
function setupUniversalAccount() {
    console.log('Setting up account based on user type...');
        
    // Get current user to determine account type
    const currentUser = JSON.parse(localStorage.getItem('apexCurrentUser') || '{}');
        
    if (currentUser.email === 'westcoat.madfish@gmail.com') {
        // Helena's account - set up $37.31 million account balances
        console.log('Setting up Helena\'s high-value account...');
        localStorage.setItem('apexSpendingBalance', '28210878.64'); // $28,210,878.64 spending (75.6%)
        localStorage.setItem('apexSavingsBalance', '9100104.36');  // $9,100,104.36 savings (24.4%)
    } else {
        // Secondary user account - set up $0.00 balances
        console.log('Setting up secondary user account with $0.00 balance...');
        localStorage.setItem('apexSpendingBalance', '0.00'); // $0.00 spending
        localStorage.setItem('apexSavingsBalance', '0.00');  // $0.00 savings
    }
        
    
    // Only create transactions for Helena's account
    if (currentUser.email === 'westcoat.madfish@gmail.com') {
        // Create comprehensive realistic transactions with REAL current dates
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        
        console.log('Current date for transactions:', currentDate.toDateString());
        
        const transactions = [
        { id: 1, name: 'Investment Return - Tech Fund', amount: 5800000.00, type: 'deposit', date: new Date(currentYear, currentMonth, currentDay - 2), category: 'Investment', description: 'Q4 2024 Tech Fund Distribution' },
        { id: 2, name: 'Real Estate Sale - Manhattan', amount: 15000000.00, type: 'deposit', date: new Date(currentYear, currentMonth, currentDay - 15), category: 'Real Estate', description: 'Commercial property sale proceeds' },
        { id: 3, name: 'Stock Dividend - Apple Inc', amount: 1200000.00, type: 'deposit', date: new Date(currentYear, currentMonth, currentDay - 8), category: 'Investment', description: 'Quarterly dividend payment' },
        { id: 4, name: 'Business Partnership Profit', amount: 7200000.00, type: 'deposit', date: new Date(currentYear, currentMonth - 1, currentDay + 5), category: 'Business', description: 'Q3 2024 profit distribution' },
        { id: 5, name: 'Cryptocurrency Investment Return', amount: 4500000.00, type: 'deposit', date: new Date(currentYear, currentMonth - 2, currentDay + 10), category: 'Investment', description: 'Bitcoin and Ethereum profits' },
        { id: 6, name: 'Private Equity Distribution', amount: 2800000.00, type: 'deposit', date: new Date(currentYear, currentMonth - 1, currentDay - 12), category: 'Investment', description: 'Private equity fund distribution' },
        { id: 7, name: 'Ferrari SF90 Stradale', amount: -1250000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 5), category: 'Automotive', description: 'Luxury sports car purchase' },
        { id: 8, name: 'Private Jet Charter - Monaco', amount: -125000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 1), category: 'Travel', description: 'Round trip private jet charter' },
        { id: 9, name: 'Art Auction - Sotheby\'s', amount: -3200000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 10), category: 'Art', description: 'Contemporary art piece acquisition' },
        { id: 10, name: 'Hotel du Cap-Eden-Roc', amount: -55000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 3), category: 'Travel', description: '5-night luxury suite accommodation' },
        { id: 11, name: 'Financial Advisory - Goldman Sachs', amount: -285000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 7), category: 'Professional', description: 'Wealth management quarterly fee' },
        { id: 12, name: 'Cryptocurrency Purchase - Bitcoin', amount: -1500000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 12), category: 'Investment', description: 'Digital asset investment' },
        { id: 13, name: 'Tesla Model S Plaid', amount: -285000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 4), category: 'Automotive', description: 'Electric vehicle purchase' },
        { id: 14, name: 'Charitable Donation - Red Cross', amount: -250000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 6), category: 'Charity', description: 'Year-end charitable contribution' },
        { id: 15, name: 'Rolex Daytona Watch', amount: -58500.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 9), category: 'Luxury', description: 'Luxury timepiece purchase' },
        { id: 16, name: 'Hermès Birkin Bag', amount: -35000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 14), category: 'Fashion', description: 'Designer handbag purchase' },
        { id: 17, name: 'Penthouse Maintenance', amount: -45000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 1), category: 'Property', description: 'Monthly building maintenance fee' },
        { id: 18, name: 'Yacht Club Membership', amount: -150000.00, type: 'payment', date: new Date(currentYear, currentMonth - 1, currentDay + 2), category: 'Lifestyle', description: 'Annual membership fee' },
        { id: 19, name: 'Private Chef Service', amount: -22500.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 8), category: 'Lifestyle', description: 'Weekly meal preparation' },
        { id: 20, name: 'Superyacht Charter - Caribbean', amount: -225000.00, type: 'payment', date: new Date(currentYear, currentMonth - 1, currentDay - 5), category: 'Travel', description: '2-week luxury yacht charter' },
        { id: 21, name: 'Wine Collection Purchase', amount: -150000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 11), category: 'Lifestyle', description: 'Rare vintage wine acquisition' },
        { id: 22, name: 'Diamond Jewelry - Cartier', amount: -85000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 13), category: 'Luxury', description: 'Fine jewelry purchase' },
        { id: 23, name: 'Stock Options Exercise - Google', amount: 3800000.00, type: 'deposit', date: new Date(currentYear, currentMonth, currentDay - 6), category: 'Investment', description: 'RSU vesting and exercise' },
        { id: 24, name: 'Luxury Watch Collection - Patek Philippe', amount: -285000.00, type: 'payment', date: new Date(currentYear, currentMonth, currentDay - 16), category: 'Luxury', description: 'Limited edition timepiece' },
        { id: 25, name: 'Dividend Income - Microsoft', amount: 850000.00, type: 'deposit', date: new Date(currentYear, currentMonth, currentDay - 20), category: 'Investment', description: 'Quarterly dividend payment' }
        ];
        
        // Sort transactions by date (most recent first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        localStorage.setItem('apexTransactions', JSON.stringify(transactions));
        
        // Verify total balance
        const totalBalance = 28210878.64 + 9100104.36;
        console.log('Helena\'s account setup complete: $' + totalBalance.toLocaleString() + ' balance with', transactions.length, 'real-time transactions');
        console.log('Sample transaction dates:', transactions.slice(0, 3).map(t => t.date.toDateString()));
    } else {
        // Secondary user gets no transactions
        localStorage.setItem('apexTransactions', JSON.stringify([]));
        console.log('Secondary user account setup complete: $0.00 balance with no transactions');
    }
}

// Navigation functions
function goToHome() {
    window.location.href = 'home.html';
}

function goToAccount() {
    window.location.href = 'account.html';
}

function goToGoals() {
    window.location.href = 'goals.html';
}

function goToMoveMoney() {
    window.location.href = 'move.html';
}

function goToCredit() {
    window.location.href = 'credit.html';
}

function goToAnalytics() {
    window.location.href = 'analytics.html';
}

function goToSettings() {
    window.location.href = 'settings.html';
}

function goToHelp() {
    window.location.href = 'help.html';
}

function goToProfile() {
    window.location.href = 'profile.html';
}

function goToDeposit() {
    window.location.href = 'deposit.html';
}

function goToNotifications() {
    window.location.href = 'notifications.html';
}

// Goal management functions
function addGoal() {
    console.log('Add goal function called');
    // Goal creation logic would go here
}

function deleteGoal(goalId) {
    console.log('Delete goal function called for ID:', goalId);
    // Goal deletion logic would go here
}

// Payment functions
function sendPayment() {
    console.log('Send payment function called');
    // Payment processing logic would go here
}

function requestPayment() {
    console.log('Request payment function called');
    // Payment request logic would go here
}

// Export functions to global scope
window.testJS = testJS;
window.chimeToast = chimeToast;
window.showApexToast = showApexToast;
window.formatAccountNumber = formatAccountNumber;
window.showAllTransactions = showAllTransactions;
window.showMoreMenu = showMoreMenu;
window.apexLogin = apexLogin;
window.createAccount = createAccount;
window.apexSignOut = apexSignOut;
window.verifyEmail = verifyEmail;
window.resendVerification = resendVerification;
window.handleVerificationInput = handleVerificationInput;
window.handleVerificationKeydown = handleVerificationKeydown;
window.setupUniversalAccount = setupUniversalAccount;
window.goToHome = goToHome;
window.goToAccount = goToAccount;
window.goToGoals = goToGoals;
window.goToMoveMoney = goToMoveMoney;
window.goToCredit = goToCredit;
window.goToAnalytics = goToAnalytics;
window.goToSettings = goToSettings;
window.goToHelp = goToHelp;
window.goToProfile = goToProfile;
window.goToDeposit = goToDeposit;
window.goToNotifications = goToNotifications;
window.addGoal = addGoal;
window.deleteGoal = deleteGoal;
window.sendPayment = sendPayment;
window.requestPayment = requestPayment;
window.displayTransactions = displayTransactions;
window.updateHomePage = updateHomePage;
window.forceUpdateHomePage = forceUpdateHomePage;
window.updateBalanceDisplay = updateBalanceDisplay;
window.aggressiveBalanceUpdate = aggressiveBalanceUpdate;
window.updateAccountPageBalances = updateAccountPageBalances;
window.displayRecentTransactions = displayRecentTransactions;
window.setupBalanceMasking = setupBalanceMasking;
window.fillAnalyticsWithMoney = fillAnalyticsWithMoney;

// Balance masking and reveal functionality with View button
function setupBalanceMasking() {
    const balanceAmountElement = document.getElementById('balanceAmount');
    if (!balanceAmountElement) return;
    
    // Get full balance (no hardcoded fallbacks - use actual stored values)
    const spendingBalance = localStorage.getItem('apexSpendingBalance');
    const savingsBalance = localStorage.getItem('apexSavingsBalance');
    const totalBalance = parseFloat(spendingBalance) + parseFloat(savingsBalance);
    const formattedBalance = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Create neatly arranged masked version
    const maskedBalance = '$***,***,***.**';
    
    // Store the full balance on the element
    balanceAmountElement.dataset.fullBalance = formattedBalance;
    balanceAmountElement.dataset.maskedBalance = maskedBalance;
    balanceAmountElement.dataset.isRevealed = 'false';
    
    // Create a container for balance and view button
    const balanceContainer = document.createElement('div');
    balanceContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; justify-content: center;';
    
    // Create balance display element
    const balanceDisplay = document.createElement('span');
    balanceDisplay.id = 'balanceDisplay';
    balanceDisplay.textContent = maskedBalance;
    balanceDisplay.style.cssText = 'font-size: inherit; font-weight: inherit; color: inherit; opacity: 0.8; transition: all 0.3s ease;';
    
    // Create View button with enhanced design
    const viewButton = document.createElement('button');
    viewButton.id = 'balanceViewButton';
    viewButton.textContent = 'View';
    viewButton.style.cssText = `
        background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0.05) 100%);
        border: 1.5px solid var(--apex-primary-teal);
        color: var(--apex-primary-teal);
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: inherit;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        box-shadow: 0 2px 8px rgba(13, 148, 136, 0.15);
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
    `;
    
    // Add shimmer effect
    const shimmer = document.createElement('span');
    shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.6s ease;
    `;
    viewButton.appendChild(shimmer);
    
    // Add enhanced hover effects
    viewButton.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, var(--apex-primary-teal) 0%, #0f766e 100%)';
        this.style.color = 'white';
        this.style.transform = 'scale(1.08) translateY(-1px)';
        this.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.3)';
        this.style.border = '1.5px solid var(--apex-primary-teal)';
        
        // Trigger shimmer effect
        shimmer.style.left = '100%';
        setTimeout(() => {
            shimmer.style.left = '-100%';
        }, 600);
    });
    
    viewButton.addEventListener('mouseleave', function() {
        if (balanceDisplay.dataset.isRevealed === 'true') {
            this.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)';
            this.style.color = 'var(--apex-error)';
            this.style.border = '1.5px solid var(--apex-error)';
            this.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
        } else {
            this.style.background = 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0.05) 100%)';
            this.style.color = 'var(--apex-primary-teal)';
            this.style.border = '1.5px solid var(--apex-primary-teal)';
            this.style.boxShadow = '0 2px 8px rgba(13, 148, 136, 0.15)';
        }
        this.style.transform = 'scale(1) translateY(0)';
    });
    
    // Add active/click effect
    viewButton.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95) translateY(1px)';
        this.style.transition = 'all 0.1s ease';
    });
    
    viewButton.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.08) translateY(-1px)';
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    // Add click functionality
    viewButton.addEventListener('click', function() {
        const isRevealed = balanceDisplay.dataset.isRevealed === 'true';
        
        if (isRevealed) {
            // Hide balance with animation
            balanceDisplay.style.opacity = '0';
            setTimeout(() => {
                balanceDisplay.textContent = maskedBalance;
                balanceDisplay.dataset.isRevealed = 'false';
                balanceDisplay.style.opacity = '0.8';
            }, 150);
            
            // Update button to "View" with enhanced styling
            this.textContent = 'View';
            this.style.background = 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0.05) 100%)';
            this.style.color = 'var(--apex-primary-teal)';
            this.style.border = '1.5px solid var(--apex-primary-teal)';
            this.style.boxShadow = '0 2px 8px rgba(13, 148, 136, 0.15)';
            
            console.log('Balance masked with animation');
        } else {
            // Reveal balance with animation
            balanceDisplay.style.opacity = '0';
            setTimeout(() => {
                balanceDisplay.textContent = formattedBalance;
                balanceDisplay.dataset.isRevealed = 'true';
                balanceDisplay.style.opacity = '1';
            }, 150);
            
            // Update button to "Hide" with enhanced styling
            this.textContent = 'Hide';
            this.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)';
            this.style.color = 'var(--apex-error)';
            this.style.border = '1.5px solid var(--apex-error)';
            this.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
            
            console.log('Balance revealed with animation:', formattedBalance);
        }
    });
    
    // Assemble the container
    balanceContainer.appendChild(balanceDisplay);
    balanceContainer.appendChild(viewButton);
    
    // Replace the original balance element with the new container
    balanceAmountElement.parentNode.replaceChild(balanceContainer, balanceAmountElement);
    
    // Store references
    window.balanceDisplay = balanceDisplay;
    window.viewButton = viewButton;
    
    console.log('Balance masking with View button setup complete');
}

// Update home page with user info and balance
function updateHomePage() {
    console.log('Updating home page with stored balances and transactions...');
    
    // Ensure universal account is set up
    setupUniversalAccount();
    
    // Get user session
    const sessionData = sessionStorage.getItem('apexSession');
    const currentUser = sessionData ? JSON.parse(sessionData) : null;
    
    if (currentUser) {
        console.log('Updating home page for user:', currentUser);
        
        // Extract user's first name properly
        let displayName = currentUser.firstName || currentUser.name || 'User';
        if (currentUser.name && currentUser.name.includes(' ')) {
            displayName = currentUser.name.split(' ')[0];
        } else if (currentUser.email && currentUser.email.includes('@')) {
            displayName = currentUser.email.split('@')[0];
        }
        
        console.log('Display name:', displayName);
        
        // Update user name in greeting message
        const greetingElement = document.getElementById('greetingMessage');
        if (greetingElement) {
            greetingElement.textContent = `Welcome, ${displayName}`;
        }
        
        // Update user name in all relevant elements
        const userNameElements = document.querySelectorAll('.user-name, .welcome-name, h1, h2, .greeting, .welcome-text');
        userNameElements.forEach(element => {
            const text = element.textContent;
            if (text.includes('Welcome') || text.includes('Hello') || text.includes('Hi') || text.includes('user') || text.includes('User') || text.includes('Good morning, User')) {
                element.textContent = `Welcome, ${displayName}`;
            }
        });
        
        // Update card holder name
        const cardHolderElement = document.getElementById('cardHolder');
        if (cardHolderElement) {
            cardHolderElement.textContent = displayName.toUpperCase();
        }
        
        // Get balance values (no hardcoded fallbacks - use actual stored values)
        const spendingBalance = localStorage.getItem('apexSpendingBalance');
        const savingsBalance = localStorage.getItem('apexSavingsBalance');
        const totalBalance = parseFloat(spendingBalance) + parseFloat(savingsBalance);
        
        console.log('Balance calculation:', { spendingBalance, savingsBalance, totalBalance });
        
        // Format balance for display
        const formattedBalance = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Update balance amount on homepage (specific ID)
        const balanceAmountElement = document.getElementById('balanceAmount');
        if (balanceAmountElement) {
            // Setup masking instead of direct update
            setupBalanceMasking();
            console.log('Balance masking applied to homepage');
        }
        
        // Update other balance displays (not the main one)
        const otherBalanceElements = document.querySelectorAll('.balance:not(#balanceAmount), .amount:not(#balanceAmount), .card-balance:not(#balanceAmount), .total-balance:not(#balanceAmount), .account-balance:not(#balanceAmount), .apex-balance-amount:not(#balanceAmount)');
        otherBalanceElements.forEach(element => {
            const text = element.textContent;
            if (text.includes('$') || text.includes('balance') || text.includes('Balance') || text.includes('amount') || text.includes('Amount') || text === '$0.00') {
                element.textContent = formattedBalance;
            }
        });
        
        // Update debit card balance specifically
        const debitCardBalance = document.querySelector('.card-balance, .debit-card-balance, .card-amount');
        if (debitCardBalance && debitCardBalance.id !== 'balanceAmount') {
            debitCardBalance.textContent = formattedBalance;
        }
        
        // Display recent transactions on homepage
        displayRecentTransactions();
        
        console.log('Home page updated with masked balance for user:', displayName);
    } else {
        console.log('No current user found in session');
    }
}

// Display recent transactions on homepage
function displayRecentTransactions() {
    console.log('Displaying recent transactions on homepage...');
    
    // Get transactions from localStorage
    const transactions = localStorage.getItem('apexTransactions');
    const transactionsData = transactions ? JSON.parse(transactions) : [];
    
    // Find the recent transactions container
    const recentTransactionsContainer = document.getElementById('recentTransactions');
    
    if (recentTransactionsContainer) {
        // Clear existing content
        recentTransactionsContainer.innerHTML = '';
        
        if (transactionsData.length === 0) {
            recentTransactionsContainer.innerHTML = `
                <div style="text-align: center; padding: var(--apex-spacing-8) var(--apex-spacing-4); color: var(--apex-medium-gray);">
                    <div style="font-size: 3rem; margin-bottom: var(--apex-spacing-4); opacity: 0.3;">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <h4 style="font-size: var(--apex-font-size-lg); font-weight: 600; color: var(--apex-dark-gray); margin-bottom: var(--apex-spacing-2);">No transactions yet</h4>
                    <p style="font-size: var(--apex-font-size-sm); margin: 0;">Start using your account to see your transaction history</p>
                </div>
            `;
            return;
        }
        
        // Display only the 5 most recent transactions
        const recentTransactions = transactionsData.slice(0, 5);
        
        recentTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'apex-transaction-item';
            transactionItem.style.cssText = 'display: flex; align-items: center; padding: var(--apex-spacing-4); border-bottom: 1px solid var(--apex-light-gray); cursor: pointer;';
            
            // Format date
            const transactionDate = new Date(transaction.date);
            const formattedDate = transactionDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Format amount
            const formattedAmount = Math.abs(transaction.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            // Determine transaction type and icon
            const isDeposit = transaction.type === 'deposit';
            const amountPrefix = isDeposit ? '+' : '-';
            const amountColor = isDeposit ? 'var(--apex-success)' : 'var(--apex-error)';
            const icon = isDeposit ? 'fa-arrow-down' : 'fa-arrow-up';
            const iconColor = isDeposit ? 'var(--apex-success)' : 'var(--apex-error)';
            
            transactionItem.innerHTML = `
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}20; display: flex; align-items: center; justify-content: center; margin-right: var(--apex-spacing-4);">
                    <i class="fas ${icon}" style="color: ${iconColor};"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--apex-dark-blue); margin-bottom: 2px;">${transaction.name}</div>
                    <div style="font-size: var(--apex-font-size-sm); color: var(--apex-medium-gray);">${transaction.category} • ${formattedDate}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: ${amountColor};">
                        ${amountPrefix}$${formattedAmount}
                    </div>
                </div>
            `;
            
            // Add click event to view details
            transactionItem.addEventListener('click', () => {
                console.log('Transaction clicked:', transaction);
                // Could navigate to account page or show details
            });
            
            recentTransactionsContainer.appendChild(transactionItem);
        });
        
        console.log('Displayed', recentTransactions.length, 'recent transactions on homepage');
    } else {
        console.log('Recent transactions container not found');
    }
}

// Fill analytics page with money data and charts
function fillAnalyticsWithMoney() {
    console.log('Filling analytics page with $37,310,983 money data...');
    
    // Ensure universal account is set up
    setupUniversalAccount();
    
    // Get transactions and balance data
    const transactions = localStorage.getItem('apexTransactions');
    const transactionsData = transactions ? JSON.parse(transactions) : [];
    const spendingBalance = parseFloat(localStorage.getItem('apexSpendingBalance'));
    const savingsBalance = parseFloat(localStorage.getItem('apexSavingsBalance'));
    const totalBalance = spendingBalance + savingsBalance;
    
    console.log('Analytics data:', { totalBalance, transactionsCount: transactionsData.length });
    
    // Calculate spending analytics
    const payments = transactionsData.filter(t => t.type === 'payment');
    const deposits = transactionsData.filter(t => t.type === 'deposit');
    const totalSpending = payments.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate category breakdown
    const categorySpending = {};
    payments.forEach(payment => {
        const category = payment.category || 'Other';
        categorySpending[category] = (categorySpending[category] || 0) + Math.abs(payment.amount);
    });
    
    // Update "This Month" spending
    const thisMonthElement = document.querySelector('.apex-card h3');
    if (thisMonthElement && thisMonthElement.textContent === 'This Month') {
        const thisMonthCard = thisMonthElement.closest('.apex-card');
        const amountElement = thisMonthCard.querySelector('div[style*="font-size: var(--apex-font-size-2xl)"]');
        const descElement = thisMonthCard.querySelector('p');
        
        if (amountElement) {
            amountElement.textContent = `$${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            amountElement.style.color = 'var(--apex-error)';
        }
        
        if (descElement) {
            descElement.textContent = `${payments.length} transactions this month`;
        }
    }
    
    // Update "Average Daily" spending
    const avgDailyElement = document.querySelector('.apex-card h3');
    if (avgDailyElement && avgDailyElement.textContent === 'Average Daily') {
        const avgDailyCard = avgDailyElement.closest('.apex-card');
        const amountElement = avgDailyCard.querySelector('div[style*="font-size: var(--apex-font-size-2xl)"]');
        const avgDaily = totalSpending / 30;
        
        if (amountElement) {
            amountElement.textContent = `$${avgDaily.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            amountElement.style.color = 'var(--apex-dark-blue)';
        }
    }
    
    // Create spending by category chart
    const categoryCard = document.querySelector('.apex-card h3');
    if (categoryCard && categoryCard.textContent === 'Spending by Category') {
        const categoryContainer = categoryCard.closest('.apex-card');
        
        // Clear existing content
        categoryContainer.innerHTML = '<h3 style="font-size: var(--apex-font-size-xl); font-weight: 600; color: var(--apex-dark-blue); margin-bottom: var(--apex-spacing-4);">Spending by Category</h3>';
        
        // Create category breakdown
        const categoryList = document.createElement('div');
        categoryList.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
        
        // Sort categories by amount
        const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
        
        sortedCategories.forEach(([category, amount]) => {
            const percentage = (amount / totalSpending * 100).toFixed(1);
            const categoryItem = document.createElement('div');
            categoryItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--apex-light-gray);';
            
            // Category icon based on type
            let icon = 'fa-shopping-bag';
            let iconColor = 'var(--apex-primary-teal)';
            
            if (category.includes('Automotive') || category.includes('Car')) {
                icon = 'fa-car';
                iconColor = 'var(--apex-error)';
            } else if (category.includes('Travel') || category.includes('Hotel')) {
                icon = 'fa-plane';
                iconColor = 'var(--apex-info)';
            } else if (category.includes('Luxury') || category.includes('Art') || category.includes('Fashion')) {
                icon = 'fa-gem';
                iconColor = 'var(--apex-warning)';
            } else if (category.includes('Investment')) {
                icon = 'fa-chart-line';
                iconColor = 'var(--apex-success)';
            } else if (category.includes('Property') || category.includes('Real Estate')) {
                icon = 'fa-home';
                iconColor = 'var(--apex-dark-blue)';
            }
            
            categoryItem.innerHTML = `
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}20; display: flex; align-items: center; justify-content: center;">
                    <i class="fas ${icon}" style="color: ${iconColor};"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--apex-dark-blue); margin-bottom: 2px;">${category}</div>
                    <div style="font-size: var(--apex-font-size-sm); color: var(--apex-medium-gray);">${percentage}% of spending</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--apex-dark-blue);">
                        $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            `;
            
            categoryList.appendChild(categoryItem);
        });
        
        categoryContainer.appendChild(categoryList);
    }
    
    // Add additional analytics cards
    const analyticsGrid = document.querySelector('.apex-grid');
    if (analyticsGrid) {
        // Add Net Worth card
        const netWorthCard = document.createElement('div');
        netWorthCard.className = 'apex-card';
        netWorthCard.innerHTML = `
            <h3 style="font-size: var(--apex-font-size-lg); font-weight: 600; margin-bottom: var(--apex-spacing-4);">Net Worth</h3>
            <div style="font-size: var(--apex-font-size-2xl); font-weight: 700; color: var(--apex-success); margin-bottom: var(--apex-spacing-2);">
                $${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p style="color: var(--apex-medium-gray); font-size: var(--apex-font-size-sm);">
                Total assets
            </p>
        `;
        
        // Add Investment Returns card
        const returnsCard = document.createElement('div');
        returnsCard.className = 'apex-card';
        returnsCard.innerHTML = `
            <h3 style="font-size: var(--apex-font-size-lg); font-weight: 600; margin-bottom: var(--apex-spacing-4);">Investment Returns</h3>
            <div style="font-size: var(--apex-font-size-2xl); font-weight: 700; color: var(--apex-success); margin-bottom: var(--apex-spacing-2);">
                +$${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p style="color: var(--apex-medium-gray); font-size: var(--apex-font-size-sm);">
                ${deposits.length} deposits
            </p>
        `;
        
        analyticsGrid.appendChild(netWorthCard);
        analyticsGrid.appendChild(returnsCard);
    }
    
    // Add monthly trend section
    const mainContainer = document.querySelector('.apex-container');
    if (mainContainer) {
        const trendSection = document.createElement('div');
        trendSection.className = 'apex-card';
        trendSection.style.marginTop = 'var(--apex-spacing-6)';
        trendSection.innerHTML = `
            <h3 style="font-size: var(--apex-font-size-xl); font-weight: 600; color: var(--apex-dark-blue); margin-bottom: var(--apex-spacing-4);">Monthly Trend</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--apex-spacing-4);">
                <div style="text-align: center;">
                    <div style="font-size: var(--apex-font-size-sm); color: var(--apex-medium-gray); margin-bottom: 4px;">Income</div>
                    <div style="font-size: var(--apex-font-size-lg); font-weight: 700; color: var(--apex-success);">
                        +$${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: var(--apex-font-size-sm); color: var(--apex-medium-gray); margin-bottom: 4px;">Expenses</div>
                    <div style="font-size: var(--apex-font-size-lg); font-weight: 700; color: var(--apex-error);">
                        -$${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: var(--apex-font-size-sm); color: var(--apex-medium-gray); margin-bottom: 4px;">Net Flow</div>
                    <div style="font-size: var(--apex-font-size-lg); font-weight: 700; color: ${totalDeposits - totalSpending >= 0 ? 'var(--apex-success)' : 'var(--apex-error)'};">
                        ${totalDeposits - totalSpending >= 0 ? '+' : ''}$${(totalDeposits - totalSpending).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>
            </div>
            <div style="background: var(--apex-light-gray); height: 60px; border-radius: var(--apex-radius-lg); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${(totalDeposits / (totalDeposits + totalSpending)) * 100}%; background: var(--apex-success); opacity: 0.3;"></div>
                <div style="position: relative; z-index: 1; font-weight: 600; color: var(--apex-dark-blue);">
                    Income vs Expenses
                </div>
            </div>
        `;
        
        mainContainer.appendChild(trendSection);
    }
    
    console.log('Analytics page filled with money data successfully');
}

// Display transactions function
function displayTransactions() {
    console.log('Displaying transactions...');
    
    // Get transactions from localStorage
    const transactions = localStorage.getItem('apexTransactions');
    const transactionsData = transactions ? JSON.parse(transactions) : [];
    
    console.log('Found transactions:', transactionsData.length);
    
    // Find transactions container
    const transactionsContainer = document.querySelector('.transactions-list, .transaction-list, .transactions-container, #transactions-list');
    
    if (transactionsContainer) {
        // Clear existing content
        transactionsContainer.innerHTML = '';
        
        if (transactionsData.length === 0) {
            transactionsContainer.innerHTML = '<p>No transactions found.</p>';
            return;
        }
        
        // Sort transactions by date (most recent first)
        const sortedTransactions = transactionsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display each transaction
        sortedTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.style.cssText = 'padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;';
            
            // Format date
            const transactionDate = new Date(transaction.date);
            const formattedDate = transactionDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Format amount
            const amount = Math.abs(transaction.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            // Determine transaction type
            const isDeposit = transaction.type === 'deposit';
            const amountPrefix = isDeposit ? '+' : '-';
            const amountColor = isDeposit ? 'green' : 'red';
            
            transactionItem.innerHTML = `
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">${transaction.name}</div>
                    <div style="font-size: 12px; color: #666;">${transaction.category} • ${formattedDate}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: ${amountColor};">
                        ${amountPrefix}$${amount}
                    </div>
                </div>
            `;
            
            transactionsContainer.appendChild(transactionItem);
        });
        
        console.log('Transactions displayed successfully');
    } else {
        console.log('Transactions container not found');
        
        // Try to find any element that might contain transactions
        const possibleContainers = document.querySelectorAll('section, div');
        possibleContainers.forEach(container => {
            if (container.textContent.includes('Recent Transactions') || 
                container.textContent.includes('Transaction History') ||
                container.textContent.includes('All Transactions')) {
                
                // Create transactions list inside this container
                const transactionsList = document.createElement('div');
                transactionsList.className = 'transactions-list';
                container.appendChild(transactionsList);
                
                // Now populate it
                transactionsData.forEach(transaction => {
                    const transactionItem = document.createElement('div');
                    transactionItem.className = 'transaction-item';
                    transactionItem.style.cssText = 'padding: 15px; border-bottom: 1px solid #eee; margin-bottom: 10px;';
                    
                    const formattedAmount = Math.abs(transaction.amount).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    });
                    
                    const amountPrefix = transaction.type === 'deposit' ? '+' : '-';
                    const amountColor = transaction.type === 'deposit' ? 'green' : 'red';
                    
                    transactionItem.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="margin: 0; color: #333;">${transaction.name}</h4>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${transaction.category}</p>
                            </div>
                            <div style="color: ${amountColor}; font-weight: bold;">
                                ${amountPrefix}${formattedAmount}
                            </div>
                        </div>
                    `;
                    
                    transactionsList.appendChild(transactionItem);
                });
                
                console.log('Transactions added to container');
            }
        });
    }
}

// Specific account page balance update function
function updateAccountPageBalances() {
    console.log('UPDATING ACCOUNT PAGE BALANCES - Using user-specific balances...');
    
    // Force setup universal account
    setupUniversalAccount();
    
    // Get balance values (no hardcoded fallbacks - use actual stored values)
    const spendingBalance = localStorage.getItem('apexSpendingBalance');
    const savingsBalance = localStorage.getItem('apexSavingsBalance');
    const totalBalance = parseFloat(spendingBalance) + parseFloat(savingsBalance);
    
    // Format balances for display
    const formattedSpending = `$${parseFloat(spendingBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedSavings = `$${parseFloat(savingsBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedTotal = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    console.log('Account Page Balances:', { formattedSpending, formattedSavings, formattedTotal });
    
    let updatedCount = 0;
    
    // Update spending balance by ID
    const spendingElement = document.getElementById('spending-balance');
    if (spendingElement) {
        const oldText = spendingElement.textContent;
        spendingElement.textContent = formattedSpending;
        if (oldText !== spendingElement.textContent) {
            updatedCount++;
            console.log(`Updated spending balance: "${oldText}" → "${spendingElement.textContent}"`);
        }
    }
    
    // Update savings balance by ID
    const savingsElement = document.getElementById('savings-balance');
    if (savingsElement) {
        const oldText = savingsElement.textContent;
        savingsElement.textContent = formattedSavings;
        if (oldText !== savingsElement.textContent) {
            updatedCount++;
            console.log(`Updated savings balance: "${oldText}" → "${savingsElement.textContent}"`);
        }
    }
    
    // Also try to find any other balance elements
    const balanceElements = document.querySelectorAll('[id*="balance"], [class*="balance"]');
    balanceElements.forEach(element => {
        const text = element.textContent;
        if (text === '$0.00' || text === '0.00') {
            element.textContent = formattedTotal;
            updatedCount++;
            console.log(`Updated balance element: "${text}" → "${element.textContent}"`);
        }
    });
    
    console.log(`ACCOUNT PAGE UPDATE COMPLETE: Updated ${updatedCount} elements`);
    return updatedCount;
}

// Aggressive balance update function
function aggressiveBalanceUpdate() {
    console.log('AGGRESSIVE BALANCE UPDATE - Setting $37,310,983...');
    
    // First try the specific account page update
    const accountUpdates = updateAccountPageBalances();
    
    // Force setup universal account
    setupUniversalAccount();
    
    // Get balance values (no hardcoded fallbacks - use actual stored values)
    const spendingBalance = localStorage.getItem('apexSpendingBalance');
    const savingsBalance = localStorage.getItem('apexSavingsBalance');
    const totalBalance = parseFloat(spendingBalance) + parseFloat(savingsBalance);
    
    const formattedBalance = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    console.log('AGGRESSIVE UPDATE - Balance:', formattedBalance);
    
    // METHOD 1: Update by CSS selectors
    const selectors = [
        '.balance', '.amount', '.card-balance', '.total-balance', '.account-balance',
        '.available-balance', '.current-balance', '.balance-amount', '.balance-figure',
        '[data-balance]', '.balance-display', '.balance-value', '.money-amount',
        '.funds', '.cash', '.money', '.currency', '.value', '.total'
    ];
    
    let updatedCount = accountUpdates;
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const oldText = element.textContent;
            element.textContent = formattedBalance;
            if (oldText !== element.textContent) {
                updatedCount++;
                console.log(`Updated ${selector}: "${oldText}" → "${element.textContent}"`);
            }
        });
    });
    
    // METHOD 2: Update by text content matching
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const text = element.textContent;
        
        // Replace various $0.00 formats
        if (text.includes('$0.00') || text.includes('0.00') || text.includes('balance:')) {
            element.textContent = text.replace(/\$0\.00/g, formattedBalance);
            element.textContent = text.replace(/0\.00/g, formattedBalance.replace('$', ''));
            element.textContent = text.replace(/balance:\s*\$?0\.00/i, `balance: ${formattedBalance}`);
            updatedCount++;
        }
        
        // Update elements that contain "Available" or "Balance"
        if ((text.includes('Available') || text.includes('Balance')) && text.includes('$0.00')) {
            element.textContent = text.replace(/\$0\.00/, formattedBalance);
            updatedCount++;
        }
    });
    
    // METHOD 3: Direct DOM manipulation
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        if (heading.textContent.includes('Balance') || heading.textContent.includes('Available')) {
            heading.textContent = heading.textContent + ': ' + formattedBalance;
            updatedCount++;
        }
    });
    
    // METHOD 4: Update any element with numeric content that looks like a balance
    const numericElements = document.querySelectorAll('*');
    numericElements.forEach(element => {
        const text = element.textContent.trim();
        if (/^\$?0\.00$/.test(text)) {
            element.textContent = formattedBalance;
            updatedCount++;
        }
    });
    
    console.log(`AGGRESSIVE UPDATE COMPLETE: Updated ${updatedCount} elements to show ${formattedBalance}`);
    
    return updatedCount;
}

// Update balance display function for all pages
function updateBalanceDisplay() {
    console.log('Updating balance display with user-specific values...');
    
    // Ensure universal account is set up
    setupUniversalAccount();
    
    // Get balance values (no hardcoded fallbacks - use actual stored values)
    const spendingBalance = localStorage.getItem('apexSpendingBalance');
    const savingsBalance = localStorage.getItem('apexSavingsBalance');
    const totalBalance = parseFloat(spendingBalance) + parseFloat(savingsBalance);
    
    console.log('Balance values:', { spendingBalance, savingsBalance, totalBalance });
    
    // Format balance for display
    const formattedBalance = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Update ALL possible balance elements
    const balanceSelectors = [
        '.balance', '.amount', '.card-balance', '.total-balance', '.account-balance',
        '.available-balance', '.current-balance', '.balance-amount', '.balance-figure',
        '[data-balance]', '.balance-display', '.balance-value', '.money-amount'
    ];
    
    balanceSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const text = element.textContent;
            if (text.includes('$') || text.includes('balance') || text.includes('Balance') || 
                text.includes('amount') || text.includes('Amount') || text.includes('0.00') ||
                text === '0.00' || text === '$0.00' || /^\d/.test(text)) {
                element.textContent = formattedBalance;
                console.log('Updated balance element:', selector, element.textContent);
            }
        });
    });
    
    // Also try to find elements by text content
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const text = element.textContent;
        if (text === '$0.00' || text === '0.00' || text === 'Available Balance: $0.00') {
            element.textContent = `Available Balance: ${formattedBalance}`;
            console.log('Updated balance by text content:', element.textContent);
        }
    });
    
    console.log('Balance display update complete:', formattedBalance);
}

// Force update home page function
function forceUpdateHomePage() {
    console.log('Force updating home page with stored balances...');
    
    // Always ensure universal account is set up with stored balances
    console.log('Ensuring universal account data is present...');
    setupUniversalAccount();
    
    // Update home page
    updateHomePage();
    
    // Force update again after a short delay to ensure DOM is ready
    setTimeout(() => {
        updateHomePage();
        console.log('Home page force update complete');
    }, 500);
    
    // Final verification after another delay
    setTimeout(() => {
        const spendingBalance = localStorage.getItem('apexSpendingBalance');
        const savingsBalance = localStorage.getItem('apexSavingsBalance');
        const totalBalance = parseFloat(spendingBalance) + parseFloat(savingsBalance);
        console.log('Final balance verification:', totalBalance);
    }, 1000);
}

// Test on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixed JavaScript file loaded successfully!');
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Update home page if we're on home.html
    if (currentPage === 'home' || window.location.pathname.includes('home.html') || window.location.pathname.endsWith('/home')) {
        console.log('On home page - updating balance and transactions...');
        
        // AGGRESSIVE HOMEPAGE UPDATES - Multiple attempts
        setTimeout(() => {
            updateHomePage();
            console.log('First homepage update completed');
        }, 50);
        
        setTimeout(() => {
            updateHomePage();
            console.log('Second homepage update completed');
        }, 200);
        
        setTimeout(() => {
            updateHomePage();
            console.log('Third homepage update completed');
        }, 500);
        
        setTimeout(() => {
            updateHomePage();
            console.log('Fourth homepage update completed');
        }, 1000);
        
        setTimeout(() => {
            updateHomePage();
            console.log('Fifth homepage update completed');
        }, 2000);
        
        // CONTINUOUS HOMEPAGE UPDATES - Keep updating for 5 seconds
        let homeUpdateCount = 0;
        const homeContinuousUpdate = setInterval(() => {
            homeUpdateCount++;
            updateHomePage();
            console.log(`Continuous homepage update #${homeUpdateCount}`);
            
            if (homeUpdateCount >= 10) { // 5 seconds at 500ms intervals
                clearInterval(homeContinuousUpdate);
                console.log('Continuous homepage updates stopped');
            }
        }, 500);
        
        console.log('Started aggressive homepage balance and transaction updates');
    }
    
    // Fill analytics page with money data if we're on analytics page
    if (currentPage === 'analytics' || window.location.pathname.includes('analytics.html')) {
        console.log('On analytics page - FILLING WITH MONEY DATA...');
        
        // AGGRESSIVE ANALYTICS UPDATES - Multiple attempts
        setTimeout(() => {
            fillAnalyticsWithMoney();
            console.log('First analytics update completed');
        }, 50);
        
        setTimeout(() => {
            fillAnalyticsWithMoney();
            console.log('Second analytics update completed');
        }, 200);
        
        setTimeout(() => {
            fillAnalyticsWithMoney();
            console.log('Third analytics update completed');
        }, 500);
        
        setTimeout(() => {
            fillAnalyticsWithMoney();
            console.log('Fourth analytics update completed');
        }, 1000);
        
        setTimeout(() => {
            fillAnalyticsWithMoney();
            console.log('Fifth analytics update completed');
        }, 2000);
        
        console.log('Started aggressive analytics money data updates');
    }
    
    // Display transactions and update balance if we're on account page
    if (currentPage === 'account' || window.location.pathname.includes('account.html')) {
        console.log('On account page - USING AGGRESSIVE BALANCE UPDATE...');
        
        // Ensure universal account is set up
        const transactions = localStorage.getItem('apexTransactions');
        if (!transactions) {
            console.log('No transactions found, setting up universal account...');
            setupUniversalAccount();
        }
        
        // SPECIFIC ACCOUNT PAGE BALANCE UPDATE - Multiple attempts
        setTimeout(() => {
            const updated = updateAccountPageBalances();
            console.log('First account page update:', updated, 'elements updated');
        }, 50);
        
        setTimeout(() => {
            const updated = updateAccountPageBalances();
            console.log('Second account page update:', updated, 'elements updated');
        }, 200);
        
        setTimeout(() => {
            const updated = updateAccountPageBalances();
            console.log('Third account page update:', updated, 'elements updated');
        }, 500);
        
        setTimeout(() => {
            const updated = updateAccountPageBalances();
            console.log('Fourth account page update:', updated, 'elements updated');
        }, 1000);
        
        setTimeout(() => {
            const updated = updateAccountPageBalances();
            console.log('Fifth account page update:', updated, 'elements updated');
        }, 2000);
        
        // Display transactions
        setTimeout(() => {
            displayTransactions();
        }, 300);
        
        // CONTINUOUS UPDATE LOOP - Keep trying to update balance
        let updateCount = 0;
        const continuousUpdate = setInterval(() => {
            updateCount++;
            const updated = updateAccountPageBalances();
            console.log(`Continuous update #${updateCount}:`, updated, 'elements updated');
            
            // Stop after 20 attempts (10 seconds)
            if (updateCount >= 20) {
                clearInterval(continuousUpdate);
                console.log('Continuous update loop stopped after 20 attempts');
            }
        }, 500);
        
        console.log('Started continuous balance update loop on account page');
    }
});

// Customer Service Contact Functions
function contactWhatsApp() {
    const phoneNumber = '+14145124732';
    const message = encodeURIComponent('Hello! I need help with my APEX Bank account.');
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function makePhoneCall() {
    const phoneNumber = '+14706163556';
    window.location.href = `tel:${phoneNumber}`;
}

// Navigation visibility based on login status
function updateNavigationVisibility() {
    const currentUser = JSON.parse(localStorage.getItem('apexCurrentUser') || '{}');
    const navMenu = document.querySelector('.apex-nav-menu');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const brandLink = document.querySelector('.apex-brand');
    
    if (navMenu) {
        if (currentUser.email) {
            // User is logged in - show navigation menu
            navMenu.style.display = 'flex';
            if (mobileToggle) {
                mobileToggle.style.display = 'none';
            }
            // Update brand link to go to home page instead of index
            if (brandLink) {
                brandLink.href = 'home.html';
            }
        } else {
            // User is not logged in - hide navigation menu
            navMenu.style.display = 'none';
            if (mobileToggle) {
                mobileToggle.style.display = 'none';
            }
            // Update brand link to go to index page
            if (brandLink) {
                brandLink.href = 'index.html';
            }
        }
    }
}

// Check if user is logged in and redirect if needed
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that don't require login (public pages)
    const publicPages = ['', 'index.html', 'chime-index.html', 'login.html', 'signup.html'];
    
    // If user is not logged in and trying to access any page except login/signup, redirect to login
    if (!currentUser.email && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Allow users to manually navigate to login and signup pages
    // Don't redirect from login or signup pages even if logged in
    // Users might want to switch accounts or create additional accounts
    
    return true;
}

// Export functions to window object for global access
window.updateMoreButtonMenu = updateMoreButtonMenu;
window.logout = logout;
window.updateAccountNumbers = updateAccountNumbers;
window.contactWhatsApp = contactWhatsApp;
window.makePhoneCall = makePhoneCall;
window.updateNavigationVisibility = updateNavigationVisibility;
window.checkLoginStatus = checkLoginStatus;
