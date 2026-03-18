// ============================================================
//  PTIT EXAM SYSTEM — AUTH & SESSION
// ============================================================

const Auth = {
    SESSION_KEY: 'ptit_session',

    login(username, password) {
        return fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
            if (status !== 200) return { success: false, error: data.message || 'Đăng nhập thất bại' };
            const session = { 
                userId: data.user.id, 
                username: data.user.username, 
                name: data.user.name, 
                role: data.user.role, 
                avatar: data.user.avatar,
                token: data.token
            };
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            return { success: true, user: session };
        })
        .catch(err => ({ success: false, error: 'Lỗi kết nối máy chủ' }));
    },

    register(username, email, password, confirmPassword, name) {
        if (!username || username.length < 4) return { success: false, error: 'Tên đăng nhập phải ít nhất 4 ký tự.' };
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return { success: false, error: 'Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới.' };
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Email không hợp lệ.' };
        if (!name || name.trim().length < 2) return { success: false, error: 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).' };
        if (!password || password.length < 6) return { success: false, error: 'Mật khẩu phải ít nhất 6 ký tự.' };
        if (password !== confirmPassword) return { success: false, error: 'Mật khẩu xác nhận không khớp.' };

        return fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, name, role: 'student' })
        })
        .then(res => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
            if (status !== 201) return { success: false, error: data.message || 'Lỗi đăng ký' };
            // Auto login after register
            return this.login(username, password);
        })
        .catch(err => ({ success: false, error: 'Lỗi kết nối máy chủ' }));
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    getSession() {
        try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)); }
        catch { return null; }
    },

    getToken() {
        const session = this.getSession();
        return session ? session.token : null;
    },

    requireAuth(role) {
        const session = this.getSession();
        if (!session) { window.location.href = role === 'admin' ? '../admin/login.html' : '../index.html'; return null; }
        if (role && session.role !== role) { window.location.href = role === 'admin' ? '../admin/login.html' : '../index.html'; return null; }
        return session;
    },

    requireAuthAdmin() {
        return this.requireAuth('admin');
    }
};
