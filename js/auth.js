// ============================================================
//  PTIT EXAM SYSTEM — AUTH (Mock, no backend)
// ============================================================

const Auth = {
    SESSION_KEY: 'ptit_session',

    async login(username, password) {
        const user = DB.users.find(u => u.username === username && u.password === password);
        if (!user) return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
        const session = {
            userId: user.id,
            username: user.username,
            name: user.name,
            email: user.email || '',
            role: user.role,
            avatar: user.avatar || user.name[0],
            studentId: user.studentId || '',
            class: user.class || '',
            class_name: user.class || ''
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true, user: session };
    },

    async register(username, email, password, confirmPassword, name) {
        if (!username || username.length < 4) return { success: false, error: 'Tên đăng nhập phải ít nhất 4 ký tự.' };
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return { success: false, error: 'Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới.' };
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Email không hợp lệ.' };
        if (!name || name.trim().length < 2) return { success: false, error: 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).' };
        if (!password || password.length < 6) return { success: false, error: 'Mật khẩu phải ít nhất 6 ký tự.' };
        if (password !== confirmPassword) return { success: false, error: 'Mật khẩu xác nhận không khớp.' };
        if (DB.users.find(u => u.username === username)) return { success: false, error: 'Tên đăng nhập đã tồn tại.' };

        const newUser = {
            id: 'u' + (DB.users.length + 1),
            username, password, name, email,
            role: 'student',
            avatar: name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
        };
        DB.users.push(newUser);
        return this.login(username, password);
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    getSession() {
        try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)); }
        catch { return null; }
    },

    getToken() {
        return 'mock-token'; // không dùng thật nữa
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
        // kept for compatibility — no-op in mock mode
        return Promise.resolve({ ok: false });
    }
};
