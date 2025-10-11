// Authentication middleware for protected routes
class AuthMiddleware {
    static isAuthenticated() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('typingTestUser');
        return token && user;
    }
    
    static getAuthToken() {
        return localStorage.getItem('authToken');
    }
    
    static getCurrentUser() {
        return {
            username: localStorage.getItem('typingTestUser'),
            email: localStorage.getItem('typingTestUserEmail'),
            type: localStorage.getItem('typingTestUserType')
        };
    }
    
    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('typingTestUser');
        localStorage.removeItem('typingTestUserEmail');
        localStorage.removeItem('typingTestUserType');
        localStorage.removeItem('typingTestUserData');
        localStorage.removeItem('preferencesComplete');
        window.location.href = 'login.html';
    }
    
    static async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getAuthToken();
        if (!token) {
            this.logout();
            return;
        }
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };
        
        try {
            const response = await fetch(url, { ...options, headers });
            
            if (response.status === 401) {
                this.logout();
                return;
            }
            
            return response;
        } catch (error) {
            console.error('Authenticated request failed:', error);
            throw error;
        }
    }
}

// Auto-redirect to login if not authenticated (for protected pages)
document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = ['preference.html', 'code-racer.html', 'dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !AuthMiddleware.isAuthenticated()) {
        window.location.href = 'login.html';
    }
});

window.AuthMiddleware = AuthMiddleware;