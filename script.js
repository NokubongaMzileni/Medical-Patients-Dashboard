// Initialize charts
function initCharts() {
    // Appointments Chart
    const appointmentsCtx = document.getElementById('appointmentsChart');
    if (appointmentsCtx) {
        new Chart(appointmentsCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [
                    {
                        label: 'Completed',
                        data: [18, 22, 19, 24, 20, 8],
                        backgroundColor: '#34a853',
                    },
                    {
                        label: 'No Show',
                        data: [2, 1, 3, 2, 1, 0],
                        backgroundColor: '#ea4335',
                    },
                    {
                        label: 'Cancelled',
                        data: [3, 2, 1, 2, 3, 1],
                        backgroundColor: '#fbbc05',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Demographics Chart
    const demographicsCtx = document.getElementById('demographicsChart');
    if (demographicsCtx) {
        new Chart(demographicsCtx, {
            type: 'doughnut',
            data: {
                labels: ['0-18', '19-35', '36-50', '51-65', '65+'],
                datasets: [{
                    data: [15, 35, 25, 15, 10],
                    backgroundColor: [
                        '#4285f4',
                        '#34a853',
                        '#fbbc05',
                        '#ea4335',
                        '#673ab7'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
}

// Toggle mobile menu
function setupMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Set active menu item based on current page
function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    setupMobileMenu();
    setActiveMenuItem();
    setupUserInterface();
    updateDashboardStats();
});

// Update dashboard statistics
function updateDashboardStats() {
    // Get elements
    const totalAppointments = document.getElementById('total-appointments');
    const completedAppointments = document.getElementById('completed-appointments');
    const pendingAppointments = document.getElementById('pending-appointments');
    const cancelledAppointments = document.getElementById('cancelled-appointments');
    const completedPercentage = document.getElementById('completed-percentage');
    const overdueCount = document.getElementById('overdue-count');
    const cancelledPercentage = document.getElementById('cancelled-percentage');
    
    // If not on dashboard page, return
    if (!totalAppointments) return;
    
    // Get appointments from localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter for today's appointments
    const todayAppointments = appointments.filter(appt => {
        const apptDate = new Date(appt.date);
        return apptDate.toDateString() === today.toDateString();
    });
    
    // Count by status
    const total = todayAppointments.length;
    const completed = todayAppointments.filter(appt => appt.status === 'Completed').length;
    const pending = todayAppointments.filter(appt => appt.status === 'Scheduled').length;
    const cancelled = todayAppointments.filter(appt => appt.status === 'Cancelled').length;
    
    // Calculate percentages
    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const cancelledPercent = total > 0 ? Math.round((cancelled / total) * 100) : 0;
    
    // Count overdue appointments
    const now = new Date();
    const overdue = todayAppointments.filter(appt => {
        if (appt.status !== 'Scheduled') return false;
        
        const apptTime = appt.time.split(':');
        const apptDateTime = new Date(appt.date);
        apptDateTime.setHours(parseInt(apptTime[0]), parseInt(apptTime[1]), 0, 0);
        
        return apptDateTime < now;
    }).length;
    
    // Update UI
    totalAppointments.textContent = total;
    completedAppointments.textContent = completed;
    pendingAppointments.textContent = pending;
    cancelledAppointments.textContent = cancelled;
    completedPercentage.textContent = `${completedPercent}% completed`;
    overdueCount.textContent = `${overdue} overdue`;
    cancelledPercentage.textContent = `${cancelledPercent}% cancelled`;
}

// Setup user interface based on current user
function setupUserInterface() {
    // Show/hide admin menu based on user role
    const adminMenu = document.querySelector('.admin-only');
    if (adminMenu) {
        if (currentUser && currentUser.role === 'admin') {
            adminMenu.style.display = 'flex';
        } else {
            adminMenu.style.display = 'none';
        }
    }
    
    // Update user profile display
    const userProfileName = document.querySelector('#user-display-name');
    if (userProfileName && currentUser) {
        let displayName = `${currentUser.firstName} ${currentUser.lastName}`;
        
        // Add title based on role
        if (currentUser.role === 'doctor') {
            displayName = `Dr. ${displayName}`;
        } else if (currentUser.role === 'admin') {
            displayName = `Admin ${displayName}`;
        }
        
        userProfileName.textContent = displayName;
    }
    
    // Update profile picture
    const profilePicElements = document.querySelectorAll('.user-profile-pic');
    if (profilePicElements.length > 0 && currentUser) {
        profilePicElements.forEach(element => {
            if (currentUser.photo) {
                // If user has a photo, display it
                element.innerHTML = `<img src="${currentUser.photo}" alt="${currentUser.firstName}" class="profile-image">`;
            } else {
                // If no photo, use the default icon
                element.innerHTML = `<i class="fas fa-user-circle" style="font-size: 1.8rem; color: var(--primary);"></i>`;
            }
        });
    }
    
    // Update all user profile displays
    const allUserProfileNames = document.querySelectorAll('.user-profile span');
    if (allUserProfileNames.length > 0 && currentUser) {
        let displayName = `${currentUser.firstName} ${currentUser.lastName}`;
        
        // Add title based on role
        if (currentUser.role === 'doctor') {
            displayName = `Dr. ${displayName}`;
        } else if (currentUser.role === 'admin') {
            displayName = `Admin ${displayName}`;
        }
        
        allUserProfileNames.forEach(span => {
            span.textContent = displayName;
        });
    }
}

// Authentication and session management
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for protected pages
    const protectedPages = ['index.html', 'patients.html', 'appointments.html', 'records.html', 'chat.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (protectedPages.includes(currentPage)) {
        if (!currentUser) {
            window.location.href = 'login.html';
            return; // Stop execution if redirecting
        } else if (currentPage === 'admin.html' && currentUser.role !== 'admin') {
            window.location.href = 'index.html';
            return; // Stop execution if redirecting
        }
    }
    
    // Add logout functionality to all pages
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
            window.location.href = 'login.html';
        });
    });
});