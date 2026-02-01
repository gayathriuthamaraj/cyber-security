const API_URL = 'http://localhost:5001/api';

// --- Auth Service ---
export const authService = {
    async initRegister(username: string, email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/register/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        return response.json();
    },

    async completeRegister(email: string, otp: string) {
        const response = await fetch(`${API_URL}/auth/register/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        return response.json();
    },

    async login(username: string, password: string) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    async verifyOTP(username: string, otp: string) {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, otp }),
        });
        return response.json();
    }
};

// --- Data Service (New) ---
export const dataService = {
    getHeaders(_username?: string) {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },

    async getGroups(username: string) {
        const res = await fetch(`${API_URL}/data/groups`, { headers: this.getHeaders(username) });
        return res.json();
    },

    async createGroup(username: string, name: string) {
        const res = await fetch(`${API_URL}/data/groups`, {
            method: 'POST',
            headers: this.getHeaders(username),
            body: JSON.stringify({ name, description: 'Created via Dashboard' })
        });
        return res.json();
    },

    async joinGroup(username: string, groupId: string) {
        const res = await fetch(`${API_URL}/data/groups/${groupId}/join`, {
            method: 'POST',
            headers: this.getHeaders(username)
        });
        return res.json();
    },

    async getAnnouncements(username: string, groupId: string) {
        const res = await fetch(`${API_URL}/data/groups/${groupId}/announcements`, { headers: this.getHeaders(username) });
        return res.json();
    },

    async createAnnouncement(username: string, groupId: string, title: string, content: string) {
        const res = await fetch(`${API_URL}/data/groups/${groupId}/announcements`, {
            method: 'POST',
            headers: this.getHeaders(username),
            body: JSON.stringify({ title, content })
        });
        return res.json();
    },

    async getChats(username: string, groupId: string) {
        const res = await fetch(`${API_URL}/data/groups/${groupId}/chats`, { headers: this.getHeaders(username) });
        return res.json();
    },

    async sendChat(username: string, groupId: string, message: string) {
        const res = await fetch(`${API_URL}/data/groups/${groupId}/chats`, {
            method: 'POST',
            headers: this.getHeaders(username),
            body: JSON.stringify({ message })
        });
        return res.json();
    }
};
