const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const state = {
  balances: {
    checking: 62480.20,
    savings: 122440.24
  },
  alertCount: 3,
  transactions: [
    { id: 1, name: 'Apex Wealth Dividend', category: 'Investment', amount: 4820.18, type: 'deposit', date: 'Today, 4:20 PM', icon: 'fa-chart-line' },
    { id: 2, name: 'Mortgage AutoPay', category: 'Housing', amount: -4250.00, type: 'payment', date: 'Today, 10:04 AM', icon: 'fa-house' },
    { id: 3, name: 'Sapphire Card Payment', category: 'Cards', amount: -1248.40, type: 'payment', date: 'Yesterday', icon: 'fa-credit-card' },
    { id: 4, name: 'Payroll Deposit', category: 'Income', amount: 12840.00, type: 'deposit', date: 'May 20', icon: 'fa-building-columns' },
    { id: 5, name: 'Nobu Palo Alto', category: 'Lifestyle', amount: -286.72, type: 'payment', date: 'May 19', icon: 'fa-utensils' },
    { id: 6, name: 'Wire to Vanguard', category: 'Transfer', amount: -7500.00, type: 'transfer', date: 'May 18', icon: 'fa-arrow-trend-up' },
    { id: 7, name: 'Lisbon Online Attempt', category: 'Security', amount: -1420.00, type: 'flagged', date: 'May 17', icon: 'fa-triangle-exclamation', flagged: true },
    { id: 8, name: 'Pacific Gas & Electric', category: 'Utilities', amount: -184.12, type: 'payment', date: 'May 16', icon: 'fa-bolt' }
  ],
  alerts: [
    { id: 1, title: 'Suspicious card attempt blocked', body: '$1,420 card-not-present charge from Lisbon was declined.', icon: 'fa-shield-halved', unread: true },
    { id: 2, title: 'Transfer completed', body: 'Your $7,500 Vanguard wire settled successfully.', icon: 'fa-circle-check', unread: true },
    { id: 3, title: 'Savings yield changed', body: 'Your high-yield savings account now earns 4.80% APY.', icon: 'fa-piggy-bank', unread: true },
    { id: 4, title: 'Mortgage autopay scheduled', body: '$4,250 will post tomorrow from checking.', icon: 'fa-house-lock', unread: false }
  ],
  payees: ['MS', 'AV', 'JP', 'RK'],
  budgets: [
    { label: 'Housing', spent: 4250, limit: 5000 },
    { label: 'Lifestyle', spent: 3840, limit: 5200 },
    { label: 'Travel', spent: 2120, limit: 3500 },
    { label: 'Investing', spent: 7500, limit: 9000 },
    { label: 'Utilities', spent: 420, limit: 650 }
  ],
  liveEvents: [
    { name: 'Blue Bottle Coffee', category: 'Dining', amount: -8.75, type: 'payment', icon: 'fa-mug-saucer' },
    { name: 'Round-up to Savings', category: 'Savings', amount: -12.25, type: 'transfer', icon: 'fa-piggy-bank' },
    { name: 'Apex Rewards Credit', category: 'Rewards', amount: 42.50, type: 'deposit', icon: 'fa-gift' },
    { name: 'Apex Rewards Credit', category: 'Rewards', amount: 42.50, type: 'deposit', icon: 'fa-gift' }
  ]
};

const titles = {
  dashboard: 'Command Center',
  transfers: 'Move Money',
  transactions: 'Transaction Intelligence',
  cards: 'Card Management',
  analytics: 'Budgeting & Analytics',
  wealth: 'Loans & Investments',
  alerts: 'Notification Center',
  security: 'Profile & Security'
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function formatSignedAmount(transaction) {
  if (transaction.amount === 0) return 'Screened';
  const value = money.format(Math.abs(transaction.amount));
  return transaction.amount > 0 ? `+${value}` : `-${value}`;
}

function showToast(message, icon = 'fa-circle-check') {
  const toast = qs('#premiumToast');
  if (!toast) return;
  toast.querySelector('i').className = `fas ${icon}`;
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.apexPremiumToastTimer);
  window.apexPremiumToastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateBalances() {
  const total = state.balances.checking + state.balances.savings;
  qs('#totalBalance').textContent = money.format(total);
  qs('#checkingBalance').textContent = money.format(state.balances.checking);
  qs('#savingsBalance').textContent = money.format(state.balances.savings);
}

function transactionTemplate(transaction) {
  const amountClass = transaction.amount > 0 ? 'positive' : '';
  const badge = transaction.flagged ? '<span class="flagged-badge">Fraud screened</span>' : '';
  return `
    <div class="transaction-row" data-type="${transaction.type}" data-search="${[transaction.name, transaction.category, transaction.date].join(' ').toLowerCase()}">
      <div class="transaction-icon"><i class="fas ${transaction.icon}"></i></div>
      <div class="transaction-main">
        <strong>${transaction.name}</strong>
        <span>${transaction.category} · ${transaction.date}</span>
        ${badge}
      </div>
      <div class="transaction-amount ${amountClass}">${formatSignedAmount(transaction)}</div>
    </div>
  `;
}

function renderTransactions() {
  const recent = qs('#recentTransactions');
  const history = qs('#transactionHistory');
  const rows = state.transactions.map(transactionTemplate).join('');
  if (recent) recent.innerHTML = state.transactions.slice(0, 5).map(transactionTemplate).join('');
  if (history) history.innerHTML = rows;
}

function renderPayees() {
  const payees = qs('#quickPayees');
  const select = qs('#recipientSelect');
  if (payees) {
    payees.innerHTML = state.payees.map(payee => `<button class="payee-chip" type="button" aria-label="Pay ${payee}">${payee}</button>`).join('');
  }
  if (select) {
    select.innerHTML = [
      'Maya Sterling ••• 1822',
      'Apex Savings ••• 7781',
      'Vanguard Brokerage',
      'Amex Platinum'
    ].map(name => `<option>${name}</option>`).join('');
  }
}

function renderBudgets() {
  const chart = qs('#budgetChart');
  const list = qs('#budgetList');
  if (chart) {
    chart.innerHTML = state.budgets.map(budget => {
      const percent = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
      return `<div class="bar-column"><i style="height:${Math.max(20, percent)}%"></i><span>${budget.label}</span></div>`;
    }).join('');
  }
  if (list) {
    list.innerHTML = state.budgets.map(budget => {
      const percent = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
      return `
        <div class="budget-row">
          <div><strong>${budget.label}</strong><span>${money.format(budget.spent)} of ${money.format(budget.limit)}</span></div>
          <div class="budget-progress"><i style="width:${percent}%"></i></div>
        </div>
      `;
    }).join('');
  }
}

function renderAlerts() {
  const list = qs('#alertList');
  if (list) {
    list.innerHTML = state.alerts.map(alert => `
      <div class="alert-item ${alert.unread ? 'unread' : ''}">
        <div class="alert-icon"><i class="fas ${alert.icon}"></i></div>
        <div>
          <strong>${alert.title}</strong>
          <span>${alert.body}</span>
        </div>
      </div>
    `).join('');
  }
  state.alertCount = state.alerts.filter(alert => alert.unread).length;
  const countText = String(state.alertCount);
  ['#navAlertCount', '#topAlertCount'].forEach(selector => {
    const element = qs(selector);
    if (element) element.textContent = countText;
  });
}

function setPage(page) {
  qsa('.page-section').forEach(section => section.classList.toggle('active', section.dataset.page === page));
  qsa('[data-page-link]').forEach(link => link.classList.toggle('active', link.dataset.pageLink === page));
  const title = qs('#pageTitle');
  if (title) title.textContent = titles[page] || 'APEX Private';
  if (location.hash !== `#${page}`) history.replaceState(null, '', `#${page}`);
}

function openBank(page = 'dashboard') {
  qs('#authShell').classList.add('hidden');
  qs('#bankShell').classList.remove('hidden');
  setPage(page);
  showToast('Secure session opened with biometric trust', 'fa-fingerprint');
}

function handleAuthTabs() {
  qsa('[data-auth-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      qsa('[data-auth-tab]').forEach(item => item.classList.remove('active'));
      qsa('.auth-form').forEach(form => form.classList.remove('active'));
      tab.classList.add('active');
      qs(`#${tab.dataset.authTab}Form`).classList.add('active');
    });
  });
}

function handleNavigation() {
  qsa('[data-page-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const page = link.dataset.pageLink;
      if (qs('#bankShell').classList.contains('hidden')) openBank(page);
      else setPage(page);
    });
  });
}

function handleForms() {
  ['#loginForm', '#signupForm'].forEach(selector => {
    const form = qs(selector);
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        openBank('dashboard');
      });
    }
  });

  const demo = qs('#demoAccessBtn');
  if (demo) demo.addEventListener('click', () => openBank('dashboard'));

  const transferForm = qs('#transferForm');
  if (transferForm) {
    transferForm.addEventListener('submit', event => {
      event.preventDefault();
      sendTransfer();
    });
  }

  const markRead = qs('#markAlertsRead');
  if (markRead) {
    markRead.addEventListener('click', () => {
      state.alerts = state.alerts.map(alert => ({ ...alert, unread: false }));
      renderAlerts();
      showToast('All alerts marked as read');
    });
  }
}

function sendTransfer() {
  const amountInput = qs('#transferAmount');
  const fromAccount = qs('#fromAccount').value;
  const recipient = qs('#recipientSelect').value;
  const memo = qs('#transferMemo').value.trim() || 'Instant transfer';
  const amount = Math.max(0, Number(amountInput.value));
  if (!amount) {
    showToast('Enter a valid transfer amount', 'fa-triangle-exclamation');
    return;
  }
  if (amount > state.balances[fromAccount]) {
    showToast('Insufficient available balance', 'fa-triangle-exclamation');
    return;
  }

  const status = qs('#transferStatus');
  const confirmation = qs('#confirmationCard');
  status.textContent = 'Screening';
  confirmation.classList.remove('success');
  confirmation.querySelector('.success-orb i').className = 'fas fa-shield-halved';
  confirmation.querySelector('h2').textContent = 'Running risk scan';
  confirmation.querySelector('p').textContent = 'Device trust, payee history, transfer limits, and fraud signals are being verified.';

  window.setTimeout(() => {
    state.balances[fromAccount] -= amount;
    state.transactions.unshift({
      id: Date.now(),
      name: recipient,
      category: 'Instant transfer',
      amount: -amount,
      type: 'transfer',
      date: 'Just now',
      icon: 'fa-paper-plane'
    });
    updateBalances();
    renderTransactions();
    status.textContent = 'Confirmed';
    confirmation.classList.add('success');
    confirmation.querySelector('.success-orb i').className = 'fas fa-circle-check';
    confirmation.querySelector('h2').textContent = 'Transfer confirmed';
    confirmation.querySelector('p').textContent = `${money.format(amount)} sent to ${recipient}. Memo: ${memo}. Balances and activity updated in real time.`;
    qsa('.rail-steps span').forEach(step => step.classList.add('active'));
    showToast(`Instant transfer sent: ${money.format(amount)}`);
  }, 850);
}

function handleFilters() {
  const search = qs('#transactionSearch');
  const filter = qs('#transactionFilter');
  function apply() {
    const term = (search?.value || '').trim().toLowerCase();
    const type = filter?.value || 'all';
    qsa('#transactionHistory .transaction-row').forEach(row => {
      const matchesTerm = !term || row.dataset.search.includes(term);
      const matchesType = type === 'all' || row.dataset.type === type;
      row.style.display = matchesTerm && matchesType ? '' : 'none';
    });
  }
  if (search) search.addEventListener('input', apply);
  if (filter) filter.addEventListener('change', apply);

  const global = qs('#globalSearch');
  if (global) {
    global.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        setPage('transactions');
        if (search) {
          search.value = global.value;
          apply();
        }
      }
    });
  }
}

function simulateLiveFeed() {
  window.setInterval(() => {
    if (document.hidden) return;
    const event = state.liveEvents[Math.floor(Math.random() * state.liveEvents.length)];
    const transaction = {
      ...event,
      id: Date.now(),
      date: 'Live now'
    };
    state.transactions.unshift(transaction);
    if (event.amount < 0) state.balances.checking += event.amount;
    if (event.amount > 0) state.balances.checking += event.amount;
    if (event.flagged) {
      state.alerts.unshift({
        id: Date.now(),
        title: 'Security monitoring event',
        body: 'Apex screened a new activity signal and kept controls active.',
        icon: 'fa-shield-halved',
        unread: true
      });
      showToast('Fraud monitoring alert added', 'fa-shield-halved');
    }
    updateBalances();
    renderTransactions();
    renderAlerts();
  }, 12000);
}

function initFromHash() {
  const hash = location.hash.replace('#', '');
  if (titles[hash]) openBank(hash);
}

document.addEventListener('DOMContentLoaded', () => {
  updateBalances();
  renderTransactions();
  renderPayees();
  renderBudgets();
  renderAlerts();
  handleAuthTabs();
  handleNavigation();
  handleForms();
  handleFilters();
  initFromHash();
  simulateLiveFeed();
});
