class TourExpenseSplitter {
    constructor() {
        this.currentTourId = null;
        this.tours = this.loadTours();
        this.expenseCategories = ['Food', 'Hotel', 'Transport', 'Tour', 'Activity', 'Shopping', 'Entertainment', 'Misc'];
        this.categoryChart = null;
        this.dailyChart = null;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    // Data Management
    loadTours() {
        try {
            const tours = localStorage.getItem('tours');
            return tours ? JSON.parse(tours) : {};
        } catch (e) {
            console.error('Error loading tours:', e);
            return {};
        }
    }

    saveTours() {
        try {
            localStorage.setItem('tours', JSON.stringify(this.tours));
        } catch (e) {
            console.error('Error saving tours:', e);
        }
    }

    getCurrentTour() {
        return this.currentTourId ? this.tours[this.currentTourId] : null;
    }

    // Initialize App
    initializeApp() {
        console.log('Initializing app...');
        this.loadSampleData();
        this.setupEventListeners();
        this.updateTourSelector();
        
        // Load current tour or show empty state
        this.currentTourId = localStorage.getItem('currentTourId');
        if (this.currentTourId && this.tours[this.currentTourId]) {
            this.loadTour(this.currentTourId);
        } else if (Object.keys(this.tours).length > 0) {
            // Auto-load first tour if available
            const firstTourId = Object.keys(this.tours)[0];
            this.loadTour(firstTourId);
        } else {
            this.showEmptyState();
        }
        
        console.log('App initialized successfully');
    }

    loadSampleData() {
        // Only load sample data if no tours exist
        if (Object.keys(this.tours).length === 0) {
            console.log('Loading Bangkok sample data...');
            const sampleTour = {
                "id": "tour_BKK25",
                "name": "Bangkok Adventure 2025",
                "description": "5-day group trip to Bangkok",
                "startDate": "2025-07-20",
                "endDate": "2025-07-24",
                "members": [
                    { "id": "m1", "name": "Alex Chen", "contact": "+1-555-0101" },
                    { "id": "m2", "name": "Sarah Johnson", "contact": "+1-555-0102" },
                    { "id": "m3", "name": "Mike Rodriguez", "contact": "+1-555-0103" },
                    { "id": "m4", "name": "Emma Taylor", "contact": "+1-555-0104" },
                    { "id": "m5", "name": "David Kim", "contact": "+1-555-0105" }
                ],
                "expenses": [
                    { "id": "e1", "date": "2025-07-20", "description": "Airport Taxi", "amount": 1200, "category": "Transport", "paidBy": "m1", "participants": ["m1","m2","m3","m4","m5"], "isHotelOrTransport": true },
                    { "id": "e2", "date": "2025-07-20", "description": "Hotel (2 nights)", "amount": 8000, "category": "Hotel", "paidBy": "m3", "participants": ["m1","m2","m3","m4","m5"], "isHotelOrTransport": true },
                    { "id": "e3", "date": "2025-07-20", "description": "Welcome Dinner", "amount": 2500, "category": "Food", "paidBy": "m2", "participants": ["m1","m2","m3","m4","m5"], "isHotelOrTransport": false },
                    { "id": "e4", "date": "2025-07-21", "description": "Temple Tour Guide", "amount": 1800, "category": "Tour", "paidBy": "m4", "participants": ["m1","m2","m3","m4"], "isHotelOrTransport": false },
                    { "id": "e5", "date": "2025-07-22", "description": "Floating Market Tour", "amount": 2800, "category": "Tour", "paidBy": "m2", "participants": ["m1","m2","m3","m4","m5"], "isHotelOrTransport": false },
                    { "id": "e6", "date": "2025-07-23", "description": "Tuk-tuk City Tour", "amount": 1500, "category": "Transport", "paidBy": "m4", "participants": ["m1","m2","m3","m4","m5"], "isHotelOrTransport": true },
                    { "id": "e7", "date": "2025-07-23", "description": "Farewell Dinner", "amount": 4200, "category": "Food", "paidBy": "m1", "participants": ["m1","m2","m3","m4","m5"], "isHotelOrTransport": false }
                ]
            };
            
            this.tours[sampleTour.id] = sampleTour;
            this.saveTours();
        }
    }

    showEmptyState() {
        const dashboard = document.getElementById('dashboard');
        const tabNav = document.querySelector('.tab-nav');
        const tabContent = document.querySelector('.tab-content');
        const emptyState = document.getElementById('emptyState');
        const exportButtons = document.getElementById('exportButtons');
        
        if (dashboard) dashboard.classList.add('hidden');
        if (tabNav) tabNav.classList.add('hidden');
        if (tabContent) tabContent.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        if (exportButtons) exportButtons.style.display = 'none';
        
        document.getElementById('currentTourName').textContent = 'No tour selected';
        document.getElementById('currentTourDescription').textContent = '';
    }

    hideEmptyState() {
        const dashboard = document.getElementById('dashboard');
        const tabNav = document.querySelector('.tab-nav');
        const tabContent = document.querySelector('.tab-content');
        const emptyState = document.getElementById('emptyState');
        const exportButtons = document.getElementById('exportButtons');
        
        if (dashboard) dashboard.classList.remove('hidden');
        if (tabNav) tabNav.classList.remove('hidden');
        if (tabContent) tabContent.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        if (exportButtons) exportButtons.style.display = 'flex';
    }

    // Tour Management
    createTour(name, description, startDate, endDate) {
        const id = 'tour_' + Date.now();
        const tour = {
            id,
            name,
            description,
            startDate: startDate || new Date().toISOString().split('T')[0],
            endDate: endDate || new Date().toISOString().split('T')[0],
            createdDate: new Date().toISOString().split('T')[0],
            members: [],
            expenses: []
        };
        
        this.tours[id] = tour;
        this.saveTours();
        this.updateTourSelector();
        this.loadTour(id);
        return id;
    }

    loadTour(tourId) {
        console.log('Loading tour:', tourId);
        this.currentTourId = tourId;
        localStorage.setItem('currentTourId', tourId);
        this.hideEmptyState();
        this.updateTourInfo();
        this.updateDashboard();
        this.buildCharts();
        this.renderMembers();
        this.renderExpenses();
        this.renderDailyView();
        this.renderBalances();
        this.generateReport();
        
        const selector = document.getElementById('tourSelector');
        if (selector) selector.value = tourId;
    }

    updateTourSelector() {
        const selector = document.getElementById('tourSelector');
        if (!selector) return;
        
        selector.innerHTML = '<option value="">Select a tour</option>';
        
        Object.values(this.tours).forEach(tour => {
            const option = document.createElement('option');
            option.value = tour.id;
            option.textContent = tour.name;
            selector.appendChild(option);
        });
    }

    updateTourInfo() {
        const tour = this.getCurrentTour();
        if (tour) {
            const nameEl = document.getElementById('currentTourName');
            const descEl = document.getElementById('currentTourDescription');
            if (nameEl) nameEl.textContent = tour.name;
            if (descEl) {
                const dateRange = tour.startDate && tour.endDate ? 
                    ` (${tour.startDate} to ${tour.endDate})` : '';
                descEl.textContent = (tour.description || '') + dateRange;
            }
        }
    }

    // Member Management - NO ADVANCE PAYMENTS
    addMember(name, contact) {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const id = 'member_' + Date.now();
        const member = {
            id,
            name,
            contact: contact || ''
        };

        tour.members.push(member);
        this.saveTours();
        this.updateDashboard();
        this.updateCharts();
        this.renderMembers();
        this.renderBalances();
        this.populateDropdowns();
    }

    deleteMember(memberId) {
        const tour = this.getCurrentTour();
        if (!tour) return;

        tour.members = tour.members.filter(m => m.id !== memberId);
        tour.expenses = tour.expenses.filter(e => 
            e.paidBy !== memberId && !e.participants.includes(memberId)
        );
        
        this.saveTours();
        this.updateDashboard();
        this.updateCharts();
        this.renderMembers();
        this.renderExpenses();
        this.renderBalances();
        this.populateDropdowns();
    }

    // Expense Management
    addExpense(description, amount, category, date, paidBy, participants) {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const id = 'expense_' + Date.now();
        const expense = {
            id,
            description: description || '',
            amount: parseFloat(amount),
            category,
            date,
            paidBy,
            participants: [...participants],
            isHotelOrTransport: category === 'Hotel' || category === 'Transport'
        };

        tour.expenses.push(expense);
        this.saveTours();
        this.updateDashboard();
        this.updateCharts();
        this.renderExpenses();
        this.renderDailyView();
        this.renderBalances();
        this.generateReport();
    }

    deleteExpense(expenseId) {
        const tour = this.getCurrentTour();
        if (!tour) return;

        tour.expenses = tour.expenses.filter(e => e.id !== expenseId);
        this.saveTours();
        this.updateDashboard();
        this.updateCharts();
        this.renderExpenses();
        this.renderDailyView();
        this.renderBalances();
        this.generateReport();
    }

    // Balance Logic - NO ADVANCE PAYMENTS
    calculateBalances() {
        const tour = this.getCurrentTour();
        if (!tour) return {};

        const balances = {};
        
        // Initialize balances - NO advance payments
        tour.members.forEach(member => {
            balances[member.id] = {
                name: member.name,
                totalPaid: 0, // Amount paid for expenses
                totalShare: 0, // Total share of all expenses
                final: 0 // Final balance = Total Paid - Total Share
            };
        });

        // Calculate expenses
        tour.expenses.forEach(expense => {
            const payer = expense.paidBy;
            const participants = expense.participants;
            const sharePerPerson = expense.amount / participants.length;

            // Add to payer's paid amount
            if (balances[payer]) {
                balances[payer].totalPaid += expense.amount;
            }

            // Add to each participant's share
            participants.forEach(participantId => {
                if (balances[participantId]) {
                    balances[participantId].totalShare += sharePerPerson;
                }
            });
        });

        // Calculate final balance: Final Balance = Total Paid - Total Share
        Object.keys(balances).forEach(memberId => {
            const balance = balances[memberId];
            balance.final = balance.totalPaid - balance.totalShare;
        });

        return balances;
    }

    calculateSettlements() {
        const balances = this.calculateBalances();
        const settlements = [];
        
        const creditors = [];
        const debtors = [];
        
        Object.entries(balances).forEach(([id, balance]) => {
            if (balance.final > 0.01) {
                creditors.push({ id, name: balance.name, amount: balance.final });
            } else if (balance.final < -0.01) {
                debtors.push({ id, name: balance.name, amount: -balance.final });
            }
        });

        // Greedy algorithm to minimize transactions
        creditors.sort((a, b) => b.amount - a.amount);
        debtors.sort((a, b) => b.amount - a.amount);

        let i = 0, j = 0;
        while (i < creditors.length && j < debtors.length) {
            const credit = creditors[i];
            const debt = debtors[j];
            const amount = Math.min(credit.amount, debt.amount);

            if (amount > 0.01) {
                settlements.push({
                    from: debt.name,
                    to: credit.name,
                    amount: amount
                });
            }

            credit.amount -= amount;
            debt.amount -= amount;

            if (credit.amount < 0.01) i++;
            if (debt.amount < 0.01) j++;
        }

        return settlements;
    }

    getDailyExpenses() {
        const tour = this.getCurrentTour();
        if (!tour) return {};

        const dailyExpenses = {};
        
        tour.expenses.forEach(expense => {
            // Exclude hotel and transport from daily calculations
            if (expense.isHotelOrTransport) return;

            const date = expense.date;
            if (!dailyExpenses[date]) {
                dailyExpenses[date] = [];
            }
            dailyExpenses[date].push(expense);
        });

        return dailyExpenses;
    }

    // Charts Management
    buildCharts() {
        this.buildCategoryChart();
        this.buildDailyChart();
    }

    updateCharts() {
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }
        if (this.dailyChart) {
            this.dailyChart.destroy();
        }
        this.buildCharts();
    }

    buildCategoryChart() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        // Calculate category totals
        const categoryTotals = {};
        this.expenseCategories.forEach(cat => categoryTotals[cat] = 0);

        tour.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const labels = [];
        const data = [];
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];

        Object.entries(categoryTotals).forEach(([category, total]) => {
            if (total > 0) {
                labels.push(category);
                data.push(total);
            }
        });

        this.categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    buildDailyChart() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const ctx = document.getElementById('dailyChart');
        if (!ctx) return;

        // Calculate daily totals INCLUDING hotel and transport
        const dailyTotals = {};
        tour.expenses.forEach(expense => {
            const date = expense.date;
            dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
        });

        const sortedDates = Object.keys(dailyTotals).sort();
        const labels = sortedDates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const data = sortedDates.map(date => dailyTotals[date]);

        this.dailyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Total',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.2,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Total: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    // UI Rendering - UPDATED for Hotel/Transport costs
    updateDashboard() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const totalExpenses = tour.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const hotelCosts = tour.expenses.filter(exp => exp.category === 'Hotel').reduce((sum, exp) => sum + exp.amount, 0);
        const transportCosts = tour.expenses.filter(exp => exp.category === 'Transport').reduce((sum, exp) => sum + exp.amount, 0);
        const totalMembers = tour.members.length;
        
        // Calculate daily average excluding hotel and transport
        const dailyExpenses = this.getDailyExpenses();
        const dailyTotal = Object.values(dailyExpenses).flat().reduce((sum, exp) => sum + exp.amount, 0);
        const uniqueDays = Object.keys(dailyExpenses).length;
        const dailyAverage = uniqueDays > 0 ? dailyTotal / uniqueDays : 0;

        const elements = {
            totalExpenses: document.getElementById('totalExpenses'),
            hotelCosts: document.getElementById('hotelCosts'),
            transportCosts: document.getElementById('transportCosts'),
            totalMembers: document.getElementById('totalMembers'),
            dailyAverage: document.getElementById('dailyAverage')
        };

        if (elements.totalExpenses) elements.totalExpenses.textContent = `$${totalExpenses.toFixed(2)}`;
        if (elements.hotelCosts) elements.hotelCosts.textContent = `$${hotelCosts.toFixed(2)}`;
        if (elements.transportCosts) elements.transportCosts.textContent = `$${transportCosts.toFixed(2)}`;
        if (elements.totalMembers) elements.totalMembers.textContent = totalMembers;
        if (elements.dailyAverage) elements.dailyAverage.textContent = `$${dailyAverage.toFixed(2)}`;
    }

    renderMembers() {
        const tour = this.getCurrentTour();
        const container = document.getElementById('membersList');
        if (!tour || !container) return;

        const balances = this.calculateBalances();
        container.innerHTML = '';
        
        tour.members.forEach(member => {
            const balance = balances[member.id] || { totalPaid: 0, totalShare: 0, final: 0 };
            
            let balanceText = 'Settled';
            let balanceClass = 'balance-zero';
            if (balance.final > 0.01) {
                balanceText = `Owed: $${balance.final.toFixed(2)}`;
                balanceClass = 'balance-positive';
            } else if (balance.final < -0.01) {
                balanceText = `Owes: $${Math.abs(balance.final).toFixed(2)}`;
                balanceClass = 'balance-negative';
            }
            
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            memberCard.innerHTML = `
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p>${member.contact || 'No contact info'}</p>
                </div>
                <div class="member-stats">
                    <p class="member-balance ${balanceClass}">${balanceText}</p>
                </div>
                <div class="member-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.deleteMember('${member.id}')">Delete</button>
                </div>
            `;
            
            container.appendChild(memberCard);
        });
    }

    renderExpenses() {
        const tour = this.getCurrentTour();
        const container = document.getElementById('expensesList');
        if (!tour || !container) return;

        const searchTerm = document.getElementById('expenseSearch')?.value?.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        
        container.innerHTML = '';
        
        let filteredExpenses = tour.expenses;
        
        if (searchTerm) {
            filteredExpenses = filteredExpenses.filter(exp => 
                exp.description.toLowerCase().includes(searchTerm) ||
                exp.category.toLowerCase().includes(searchTerm)
            );
        }
        
        if (categoryFilter) {
            filteredExpenses = filteredExpenses.filter(exp => exp.category === categoryFilter);
        }
        
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredExpenses.forEach(expense => {
            const payer = tour.members.find(m => m.id === expense.paidBy);
            const participantNames = expense.participants
                .map(id => tour.members.find(m => m.id === id)?.name)
                .filter(Boolean)
                .join(', ');
            
            const expenseCard = document.createElement('div');
            expenseCard.className = 'expense-card';
            expenseCard.innerHTML = `
                <div class="expense-main">
                    <div class="expense-header">
                        <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                        <span class="expense-category" data-category="${expense.category.toLowerCase()}">${expense.category}</span>
                    </div>
                    <div class="expense-details">
                        <span><strong>${expense.description || 'No description'}</strong></span>
                        <span>${new Date(expense.date).toLocaleDateString()}</span>
                        <span>Paid by: ${payer?.name || 'Unknown'}</span>
                        <span>Split between: ${participantNames}</span>
                    </div>
                </div>
                <div class="expense-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.deleteExpense('${expense.id}')">Delete</button>
                </div>
            `;
            
            container.appendChild(expenseCard);
        });
    }

    renderDailyView() {
        const tour = this.getCurrentTour();
        const container = document.getElementById('dailyView');
        if (!tour || !container) return;

        const dailyExpenses = this.getDailyExpenses();
        container.innerHTML = '';
        
        const sortedDates = Object.keys(dailyExpenses).sort((a, b) => new Date(b) - new Date(a));
        
        if (sortedDates.length === 0) {
            container.innerHTML = '<p>No daily expenses to display (hotel and transport expenses are excluded from daily view)</p>';
            return;
        }
        
        sortedDates.forEach(date => {
            const expenses = dailyExpenses[date];
            const dayTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const perPersonAverage = tour.members.length > 0 ? dayTotal / tour.members.length : 0;
            
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.innerHTML = `
                <div class="day-header">
                    <h3 class="day-date">${new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</h3>
                    <div class="day-total">$${dayTotal.toFixed(2)}</div>
                </div>
                <div class="day-stats">
                    <div class="day-stat">
                        <p class="day-stat-label">Expenses</p>
                        <p class="day-stat-value">${expenses.length}</p>
                    </div>
                    <div class="day-stat">
                        <p class="day-stat-label">Per Person</p>
                        <p class="day-stat-value">$${perPersonAverage.toFixed(2)}</p>
                    </div>
                </div>
                <div class="day-expenses">
                    ${expenses.map(exp => `
                        <div class="day-expense-item">
                            <span>${exp.description || exp.category}</span>
                            <span>$${exp.amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(dayCard);
        });
    }

    renderBalances() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const container = document.getElementById('balancesList');
        const settlementsContainer = document.getElementById('settlementsList');
        if (!container || !settlementsContainer) return;

        const balances = this.calculateBalances();
        const settlements = this.calculateSettlements();
        
        container.innerHTML = '';
        
        Object.entries(balances).forEach(([memberId, balance]) => {
            const balanceCard = document.createElement('div');
            balanceCard.className = 'balance-card';
            
            let balanceClass = 'balance-zero';
            let balanceText = 'Settled';
            
            if (balance.final > 0.01) {
                balanceClass = 'balance-positive';
                balanceText = `Owed: $${balance.final.toFixed(2)}`;
            } else if (balance.final < -0.01) {
                balanceClass = 'balance-negative';
                balanceText = `Owes: $${Math.abs(balance.final).toFixed(2)}`;
            }
            
            balanceCard.innerHTML = `
                <div class="balance-header">
                    <h4>${balance.name}</h4>
                    <p class="balance-final ${balanceClass}">${balanceText}</p>
                </div>
                <div class="balance-breakdown">
                    <div class="balance-item">
                        <p class="balance-label">Paid</p>
                        <p class="balance-value">$${balance.totalPaid.toFixed(2)}</p>
                    </div>
                    <div class="balance-item">
                        <p class="balance-label">Share</p>
                        <p class="balance-value">$${balance.totalShare.toFixed(2)}</p>
                    </div>
                    <div class="balance-item">
                        <p class="balance-label">Balance</p>
                        <p class="balance-value ${balanceClass}">$${balance.final.toFixed(2)}</p>
                    </div>
                </div>
            `;
            
            container.appendChild(balanceCard);
        });
        
        // Render settlements
        settlementsContainer.innerHTML = '';
        if (settlements.length === 0) {
            settlementsContainer.innerHTML = '<p>All members are settled up! No payments needed.</p>';
        } else {
            settlements.forEach(settlement => {
                const settlementItem = document.createElement('div');
                settlementItem.className = 'settlement-item';
                settlementItem.innerHTML = `
                    <span><strong>${settlement.from}</strong> should pay <strong>${settlement.to}</strong></span>
                    <span class="settlement-amount">$${settlement.amount.toFixed(2)}</span>
                `;
                settlementsContainer.appendChild(settlementItem);
            });
        }
    }

    // Generate Report Preview
    generateReport() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const reportContainer = document.getElementById('reportPreview');
        if (!reportContainer) return;

        const balances = this.calculateBalances();
        const settlements = this.calculateSettlements();
        const dailyExpenses = this.getDailyExpenses();
        
        reportContainer.innerHTML = `
            <div class="report-content">
                <h2>${tour.name}</h2>
                <p>${tour.description}</p>
                <p><strong>Duration:</strong> ${tour.startDate} to ${tour.endDate}</p>
                <hr>
                
                <h3>Summary</h3>
                <p>Total Expenses: $${tour.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
                <p>Total Members: ${tour.members.length}</p>
                <p>Hotel Costs: $${tour.expenses.filter(exp => exp.category === 'Hotel').reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
                <p>Transport Costs: $${tour.expenses.filter(exp => exp.category === 'Transport').reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
                
                <h3>Member Balances</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th class="text-right">Paid</th>
                            <th class="text-right">Share</th>
                            <th class="text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(balances).map(([id, balance]) => `
                            <tr>
                                <td>${balance.name}</td>
                                <td class="text-right">$${balance.totalPaid.toFixed(2)}</td>
                                <td class="text-right">$${balance.totalShare.toFixed(2)}</td>
                                <td class="text-right" style="color: ${balance.final > 0 ? 'green' : balance.final < 0 ? 'red' : 'inherit'};">
                                    $${balance.final.toFixed(2)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <h3>Settlement Suggestions</h3>
                ${settlements.length === 0 ? '<p>All members are settled up!</p>' : settlements.map(s => 
                    `<p><strong>${s.from}</strong> should pay <strong>${s.to}</strong>: <strong>$${s.amount.toFixed(2)}</strong></p>`
                ).join('')}
                
                <h3>Daily Breakdown (excluding hotel/transport)</h3>
                ${Object.entries(dailyExpenses).map(([date, expenses]) => `
                    <h4>${new Date(date).toLocaleDateString()}</h4>
                    <ul>
                        ${expenses.map(exp => `<li>${exp.description} - $${exp.amount.toFixed(2)} (${exp.category})</li>`).join('')}
                    </ul>
                    <p><strong>Day Total: $${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</strong></p>
                `).join('')}
            </div>
        `;
    }

    // CRITICAL PDF FIX - Use correct jsPDF initialization
    async exportPDF() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        try {
            // CRITICAL FIX: Use const { jsPDF } = window.jspdf for CDN loading
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            let yPos = 20;
            
            // Title
            doc.setFontSize(20);
            doc.text(tour.name, 20, yPos);
            yPos += 10;
            
            doc.setFontSize(12);
            doc.text(tour.description || '', 20, yPos);
            yPos += 8;
            doc.text(`${tour.startDate} to ${tour.endDate}`, 20, yPos);
            yPos += 15;
            
            // Summary
            doc.setFontSize(16);
            doc.text('Tour Summary', 20, yPos);
            yPos += 10;
            
            const totalExpenses = tour.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const hotelCosts = tour.expenses.filter(exp => exp.category === 'Hotel').reduce((sum, exp) => sum + exp.amount, 0);
            const transportCosts = tour.expenses.filter(exp => exp.category === 'Transport').reduce((sum, exp) => sum + exp.amount, 0);
            
            doc.setFontSize(10);
            doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, yPos);
            doc.text(`Total Members: ${tour.members.length}`, 20, yPos + 5);
            doc.text(`Hotel Costs: $${hotelCosts.toFixed(2)}`, 20, yPos + 10);
            doc.text(`Transport Costs: $${transportCosts.toFixed(2)}`, 20, yPos + 15);
            yPos += 25;
            
            // Add charts as compressed images
            if (this.categoryChart && this.dailyChart) {
                try {
                    // OPTIMIZED: Reduce image quality to 50% for smaller file size
                    const categoryImg = this.categoryChart.toBase64Image('image/png', 0.5);
                    const dailyImg = this.dailyChart.toBase64Image('image/png', 0.5);
                    
                    doc.addImage(categoryImg, 'PNG', 20, yPos, 80, 60, '', 'FAST');
                    doc.addImage(dailyImg, 'PNG', 110, yPos, 80, 60, '', 'FAST');
                    yPos += 70;
                } catch(e) {
                    console.warn('Could not add charts to PDF:', e);
                }
            }
            
            // Members balance table using autoTable
            const balances = this.calculateBalances();
            const memberData = tour.members.map(member => {
                const balance = balances[member.id];
                return [
                    member.name,
                    member.contact,
                    `$${balance.totalPaid.toFixed(2)}`,
                    `$${balance.totalShare.toFixed(2)}`,
                    `$${balance.final.toFixed(2)}`
                ];
            });
            
            // OPTIMIZED: Use autoTable with minimal theme and small font
            doc.autoTable({
                head: [['Member', 'Contact', 'Paid', 'Share', 'Balance']],
                body: memberData,
                startY: yPos,
                styles: { fontSize: 8 },
                theme: 'striped'
            });
            
            // Settlement suggestions
            yPos = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(14);
            doc.text('Settlement Suggestions', 20, yPos);
            yPos += 8;
            
            const settlements = this.calculateSettlements();
            if (settlements.length === 0) {
                doc.setFontSize(10);
                doc.text('All members are settled up!', 20, yPos);
            } else {
                doc.setFontSize(10);
                settlements.forEach(settlement => {
                    doc.text(`${settlement.from} should pay ${settlement.to}: $${settlement.amount.toFixed(2)}`, 20, yPos);
                    yPos += 5;
                });
            }
            
            doc.save(`${tour.name.replace(/[^a-z0-9]/gi, '_')}_report.pdf`);
            
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error generating PDF: ' + error.message + '. Please try again.');
        }
    }

    async exportExcel() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        try {
            const wb = XLSX.utils.book_new();
            
            // Summary sheet
            const hotelCosts = tour.expenses.filter(exp => exp.category === 'Hotel').reduce((sum, exp) => sum + exp.amount, 0);
            const transportCosts = tour.expenses.filter(exp => exp.category === 'Transport').reduce((sum, exp) => sum + exp.amount, 0);
            
            const summaryData = [
                ['Tour Name', tour.name],
                ['Description', tour.description || ''],
                ['Start Date', tour.startDate],
                ['End Date', tour.endDate],
                ['Total Members', tour.members.length],
                ['Total Expenses', tour.expenses.reduce((sum, exp) => sum + exp.amount, 0)],
                ['Hotel Costs', hotelCosts],
                ['Transport Costs', transportCosts]
            ];
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
            
            // Members sheet
            const balances = this.calculateBalances();
            const memberData = [
                ['Name', 'Contact', 'Total Paid', 'Total Share', 'Final Balance', 'Status']
            ];
            tour.members.forEach(member => {
                const balance = balances[member.id];
                let status = 'Settled';
                if (balance.final > 0.01) status = 'Owed Money';
                else if (balance.final < -0.01) status = 'Owes Money';
                
                memberData.push([
                    member.name,
                    member.contact,
                    balance.totalPaid,
                    balance.totalShare,
                    balance.final,
                    status
                ]);
            });
            const memberSheet = XLSX.utils.aoa_to_sheet(memberData);
            XLSX.utils.book_append_sheet(wb, memberSheet, 'Members');
            
            // Expenses sheet
            const expenseData = [
                ['Date', 'Description', 'Category', 'Amount', 'Paid By', 'Participants', 'Hotel/Transport']
            ];
            tour.expenses.forEach(expense => {
                const payer = tour.members.find(m => m.id === expense.paidBy);
                const participants = expense.participants
                    .map(id => tour.members.find(m => m.id === id)?.name)
                    .filter(Boolean)
                    .join(', ');
                
                expenseData.push([
                    expense.date,
                    expense.description,
                    expense.category,
                    expense.amount,
                    payer?.name || 'Unknown',
                    participants,
                    expense.isHotelOrTransport ? 'Yes' : 'No'
                ]);
            });
            const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
            XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expenses');
            
            // Settlement sheet
            const settlements = this.calculateSettlements();
            const settlementData = [['From', 'To', 'Amount']];
            settlements.forEach(settlement => {
                settlementData.push([settlement.from, settlement.to, settlement.amount]);
            });
            const settlementSheet = XLSX.utils.aoa_to_sheet(settlementData);
            XLSX.utils.book_append_sheet(wb, settlementSheet, 'Settlements');
            
            XLSX.writeFile(wb, `${tour.name.replace(/[^a-z0-9]/gi, '_')}_workbook.xlsx`);
        } catch (error) {
            console.error('Excel export error:', error);
            alert('Error generating Excel file. Please try again.');
        }
    }

    exportCSV() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        let csv = 'Date,Description,Category,Amount,Paid By,Participants\n';
        
        tour.expenses.forEach(expense => {
            const payer = tour.members.find(m => m.id === expense.paidBy);
            const participants = expense.participants
                .map(id => tour.members.find(m => m.id === id)?.name)
                .filter(Boolean)
                .join(';');
            
            csv += `${expense.date},"${expense.description}",${expense.category},${expense.amount},"${payer?.name}","${participants}"\n`;
        });
        
        this.downloadFile(csv, `${tour.name}_expenses.csv`, 'text/csv');
    }

    exportJSON() {
        const tour = this.getCurrentTour();
        if (!tour) return;

        const data = JSON.stringify(tour, null, 2);
        this.downloadFile(data, `${tour.name}_data.json`, 'application/json');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Dropdown Population
    populateDropdowns() {
        const tour = this.getCurrentTour();
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            this.expenseCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
        
        // Expense category dropdown
        const expenseCategory = document.getElementById('expenseCategory');
        if (expenseCategory) {
            expenseCategory.innerHTML = '<option value="">Select category</option>';
            this.expenseCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                expenseCategory.appendChild(option);
            });
        }
        
        if (!tour) return;
        
        // Paid by dropdown
        const expensePaidBy = document.getElementById('expensePaidBy');
        if (expensePaidBy) {
            expensePaidBy.innerHTML = '<option value="">Select member</option>';
            tour.members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                expensePaidBy.appendChild(option);
            });
        }
        
        // Participants checkboxes
        const participantsContainer = document.getElementById('expenseParticipants');
        if (participantsContainer) {
            participantsContainer.innerHTML = '';
            tour.members.forEach(member => {
                const participantItem = document.createElement('div');
                participantItem.className = 'participant-item';
                participantItem.innerHTML = `
                    <input type="checkbox" id="participant_${member.id}" value="${member.id}" checked>
                    <label for="participant_${member.id}">${member.name}</label>
                `;
                participantsContainer.appendChild(participantItem);
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabName = e.target.dataset.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });

        // Tour management
        const newTourBtn = document.getElementById('newTourBtn');
        if (newTourBtn) {
            newTourBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('newTourModal');
            });
        }

        const emptyNewTourBtn = document.getElementById('emptyNewTour');
        if (emptyNewTourBtn) {
            emptyNewTourBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('newTourModal');
            });
        }

        const tourSelector = document.getElementById('tourSelector');
        if (tourSelector) {
            tourSelector.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadTour(e.target.value);
                }
            });
        }

        // Export buttons - ALL with proper error handling
        const exportPDF = document.getElementById('exportPDF');
        const exportPDFLarge = document.getElementById('exportPDFLarge');
        const exportExcel = document.getElementById('exportExcel');
        const exportExcelLarge = document.getElementById('exportExcelLarge');
        const exportCSV = document.getElementById('exportCSV');
        const exportJSON = document.getElementById('exportJSON');

        if (exportPDF) exportPDF.addEventListener('click', (e) => { e.preventDefault(); this.exportPDF(); });
        if (exportPDFLarge) exportPDFLarge.addEventListener('click', (e) => { e.preventDefault(); this.exportPDF(); });
        if (exportExcel) exportExcel.addEventListener('click', (e) => { e.preventDefault(); this.exportExcel(); });
        if (exportExcelLarge) exportExcelLarge.addEventListener('click', (e) => { e.preventDefault(); this.exportExcel(); });
        if (exportCSV) exportCSV.addEventListener('click', (e) => { e.preventDefault(); this.exportCSV(); });
        if (exportJSON) exportJSON.addEventListener('click', (e) => { e.preventDefault(); this.exportJSON(); });

        // Modal event listeners
        this.setupModalListeners();

        // Form submissions
        const newTourForm = document.getElementById('newTourForm');
        if (newTourForm) {
            newTourForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('tourName').value;
                const description = document.getElementById('tourDescription').value;
                const startDate = document.getElementById('tourStartDate').value;
                const endDate = document.getElementById('tourEndDate').value;
                this.createTour(name, description, startDate, endDate);
                this.closeModal('newTourModal');
                newTourForm.reset();
            });
        }

        const addMemberForm = document.getElementById('addMemberForm');
        if (addMemberForm) {
            addMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('memberName').value;
                const contact = document.getElementById('memberContact').value;
                this.addMember(name, contact);
                this.closeModal('addMemberModal');
                addMemberForm.reset();
            });
        }

        const addExpenseForm = document.getElementById('addExpenseForm');
        if (addExpenseForm) {
            addExpenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const description = document.getElementById('expenseDescription').value;
                const amount = document.getElementById('expenseAmount').value;
                const category = document.getElementById('expenseCategory').value;
                const date = document.getElementById('expenseDate').value;
                const paidBy = document.getElementById('expensePaidBy').value;
                const participants = Array.from(document.querySelectorAll('#expenseParticipants input:checked'))
                    .map(cb => cb.value);
                
                if (!paidBy) {
                    alert('Please select who paid for this expense');
                    return;
                }
                
                if (!category) {
                    alert('Please select a category');
                    return;
                }
                
                if (participants.length === 0) {
                    alert('Please select at least one participant');
                    return;
                }
                
                this.addExpense(description, amount, category, date, paidBy, participants);
                this.closeModal('addExpenseModal');
                addExpenseForm.reset();
            });
        }

        // Quick actions - FIXED: Ensure proper event handling and modal opening
        const quickActions = {
            quickAddExpense: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchTab('expenses');
                setTimeout(() => this.openModal('addExpenseModal'), 200);
            },
            quickAddMember: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchTab('members');
                setTimeout(() => this.openModal('addMemberModal'), 200);
            },
            viewBalances: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchTab('balances');
            },
            addMemberBtn: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal('addMemberModal');
            },
            addExpenseBtn: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal('addExpenseModal');
            }
        };

        Object.entries(quickActions).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        });

        // Search and filter
        const expenseSearch = document.getElementById('expenseSearch');
        if (expenseSearch) {
            expenseSearch.addEventListener('input', () => {
                this.renderExpenses();
            });
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.renderExpenses();
            });
        }

        // Set default date
        const expenseDate = document.getElementById('expenseDate');
        if (expenseDate) {
            expenseDate.value = new Date().toISOString().split('T')[0];
        }
        
        console.log('Event listeners setup complete');
    }

    setupModalListeners() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Cancel buttons
        const cancelButtons = ['cancelTour', 'cancelMember', 'cancelExpense'];
        cancelButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modal = e.target.closest('.modal');
                    if (modal) {
                        this.closeModal(modal.id);
                    }
                });
            }
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        const activePane = document.getElementById(`${tabName}Tab`);
        if (activePane) {
            activePane.classList.add('active');
        }
    }

    // MODAL FIX - Ensure proper modal display with z-index and visibility
    openModal(modalId) {
        console.log('Opening modal:', modalId);
        
        // Close any existing modals first
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        // Populate dropdowns when opening expense modal
        if (modalId === 'addExpenseModal') {
            this.populateDropdowns();
        }
        
        const modal = document.getElementById(modalId);
        if (modal) {
            // Force display and ensure visibility
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.zIndex = '1000';
            
            // Focus first input if available
            setTimeout(() => {
                const firstInput = modal.querySelector('input[type="text"], input[type="number"], select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app...');
        app = new TourExpenseSplitter();
    });
} else {
    console.log('DOM already loaded, initializing app...');
    app = new TourExpenseSplitter();
}