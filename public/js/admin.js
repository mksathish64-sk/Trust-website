// Admin authentication check
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();

        if (!data.authenticated) {
            window.location.href = '/admin/login.html';
            return false;
        }

        // Update username display
        const usernameDisplay = document.getElementById('admin-username');
        if (usernameDisplay) {
            usernameDisplay.textContent = data.username;
        }

        return true;
    } catch (error) {
        window.location.href = '/admin/login.html';
        return false;
    }
}

// Logout function
async function logout() {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login.html';
    } catch (error) {
        alert('Logout failed');
    }
}

// API call with auth handling
async function adminApiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (response.status === 401) {
            window.location.href = '/admin/login.html';
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show admin notification
function showAdminNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Confirm dialog
function confirmAction(message) {
    return confirm(message);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date only
function formatDateOnly(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Set active menu
function setActiveMenu(pageName) {
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(pageName)) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
