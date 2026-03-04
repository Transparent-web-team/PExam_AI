// ============================================================
//  PTIT EXAM SYSTEM — AUTH & SESSION
// ============================================================

const Auth = {
    SESSION_KEY: 'ptit_session',

    login(username, password) {
        const user = DB.getUser(username);
        if (!user) return { success: false, error: 'Tên đăng nhập không tồn tại.' };
        if (user.password !== password) return { success: false, error: 'Mật khẩu không chính xác.' };
        const session = { userId: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true, user: session };
    },

    register(username, email, password, confirmPassword, name) {
        if (!username || username.length < 4) return { success: false, error: 'Tên đăng nhập phải ít nhất 4 ký tự.' };
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return { success: false, error: 'Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới.' };
        if (DB.getUser(username)) return { success: false, error: 'Tên đăng nhập đã tồn tại.' };
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Email không hợp lệ.' };
        if (!name || name.trim().length < 2) return { success: false, error: 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).' };
        if (!password || password.length < 6) return { success: false, error: 'Mật khẩu phải ít nhất 6 ký tự.' };
        if (password !== confirmPassword) return { success: false, error: 'Mật khẩu xác nhận không khớp.' };

        const newUser = {
            id: 'u' + Date.now(),
            username, password, name: name.trim(), email,
            studentId: 'B' + Math.floor(Math.random() * 90000 + 10000),
            role: 'student',
            class: 'D21CQCN01-B',
            avatar: name.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        };
        DB.users.push(newUser);
        const session = { userId: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role, avatar: newUser.avatar };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true, user: session };
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    getSession() {
        try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)); }
        catch { return null; }
    },

    requireAuth(role) {
        const session = this.getSession();
        if (!session) { window.location.href = role === 'admin' ? '../admin/login.html' : '../index.html'; return null; }
        if (role && session.role !== role) { window.location.href = role === 'admin' ? '../admin/login.html' : '../index.html'; return null; }
        return session;
    },

    requireAuthAdmin() {
        const session = this.getSession();
        if (!session) { window.location.href = 'login.html'; return null; }
        if (session.role !== 'admin') { window.location.href = 'login.html'; return null; }
        return session;
    }
};
