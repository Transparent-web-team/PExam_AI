// ============================================================
//  PTIT EXAM SYSTEM — AUTH (Connected to Spring Boot Mock API)
// ============================================================

// (API_BASE_URL is now defined in config.js)

const Auth = {
    SESSION_KEY: 'ptit_session',

    async login(username, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.message || 'Lỗi đăng nhập' };
            
            const session = data.user;
            session.token = data.token;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            return { success: true, user: session };
        } catch (e) {
            return { success: false, error: 'Không thể kết nối đến máy chủ.' };
        }
    },

    async register(username, email, password, confirmPassword, name) {
        if (!username || username.length < 4) return { success: false, error: 'Tên đăng nhập phải ít nhất 4 ký tự.' };
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return { success: false, error: 'Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới.' };
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Email không hợp lệ.' };
        if (!name || name.trim().length < 2) return { success: false, error: 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).' };
        if (!password || password.length < 6) return { success: false, error: 'Mật khẩu phải ít nhất 6 ký tự.' };
        if (password !== confirmPassword) return { success: false, error: 'Mật khẩu xác nhận không khớp.' };

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, name, role: 'student' })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.message || 'Lỗi đăng ký' };
            return this.login(username, password);
        } catch (e) {
            return { success: false, error: 'Không thể kết nối đến máy chủ.' };
        }
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    getSession() {
        try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)); }
        catch { return null; }
    },

    getToken() {
        const s = this.getSession();
        return s ? s.token : null;
    },

    requireAuth(role) {
        const session = this.getSession();
        if (!session) { window.location.href = role === 'admin' ? '../admin/login.html' : '../index.html'; return null; }
        if (role && session.role !== role) { window.location.href = role === 'admin' ? '../admin/login.html' : '../index.html'; return null; }
        return session;
    },

    requireAuthAdmin() {
        return this.requireAuth('admin');
    },

    fetchWithAuth(url, options = {}) {
        const token = this.getToken();
        const headers = { ...options.headers };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(url, { ...options, headers });
    }
};
