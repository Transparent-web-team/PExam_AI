// ============================================================
//  PTIT EXAM SYSTEM — UTILITIES
// ============================================================

// Escape HTML to prevent raw tags in option text from creating real elements
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


const Utils = {
    // ── Timer ──────────────────────────────────────────────────
    startTimer(totalSeconds, displayEl, onExpire, onTick) {
        let remaining = totalSeconds;
        const update = () => {
            const m = Math.floor(remaining / 60).toString().padStart(2, '0');
            const s = (remaining % 60).toString().padStart(2, '0');
            displayEl.textContent = m + ':' + s;
            if (remaining <= 60) { displayEl.parentElement.classList.add('danger'); displayEl.parentElement.classList.remove('warning'); }
            else if (remaining <= 300) { displayEl.parentElement.classList.add('warning'); }
            if (onTick) onTick(remaining);
            if (remaining <= 0) { clearInterval(interval); if (onExpire) onExpire(); return; }
            remaining--;
        };
        update();
        const interval = setInterval(update, 1000);
        return { stop: () => clearInterval(interval), getRemaining: () => remaining };
    },

    // ── Toast Notifications ────────────────────────────────────
    toast(message, type = 'default', duration = 3000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        const icons = { success: 'fa-check-circle', danger: 'fa-times-circle', warning: 'fa-exclamation-triangle', default: 'fa-info-circle' };
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${icons[type] || icons.default}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = '.3s'; setTimeout(() => toast.remove(), 300); }, duration);
    },

    // ── Modal helpers ──────────────────────────────────────────
    openModal(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
    },
    closeModal(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
    },
    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
    },

    // ── Formatters ─────────────────────────────────────────────
    formatDate(dateStr, opts = {}) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', ...opts });
    },
    formatDateTime(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    formatScore(score) { return (Math.round(score * 100) / 100).toFixed(2); },
    formatDuration(mins) { return mins >= 60 ? Math.floor(mins / 60) + ' giờ ' + (mins % 60 ? (mins % 60) + ' phút' : '') : mins + ' phút'; },
    formatTimeUsed(secs) { const m = Math.floor(secs / 60); const s = secs % 60; return m + ' phút ' + s + ' giây'; },

    // ── Exam type / status labels ──────────────────────────────
    typeLabel(type) {
        const map = { practice: 'Luyện tập', midterm: 'Giữa kỳ', final: 'Cuối kỳ' };
        return map[type] || type;
    },
    typeBadge(type) {
        const map = { practice: 'badge-info', midterm: 'badge-warning', final: 'badge-red' };
        return map[type] || 'badge-gray';
    },
    statusLabel(status) {
        const map = { open: 'Đang mở', scheduled: 'Theo lịch', completed: 'Đã kết thúc' };
        return map[status] || status;
    },
    statusBadge(status) {
        const map = { open: 'badge-green', scheduled: 'badge-info', completed: 'badge-gray' };
        return map[status] || 'badge-gray';
    },
    passLabel(score, passing) { return score >= passing ? 'Đạt' : 'Không đạt'; },
    passBadge(score, passing) { return score >= passing ? 'badge-green' : 'badge-red'; },

    // ── DOM helpers ────────────────────────────────────────────
    qs(sel, ctx = document) { return ctx.querySelector(sel); },
    qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; },
    el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; },

    // ── Sidebar toggle (admin) ─────────────────────────────────
    initSidebar() {
        const toggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
            document.addEventListener('click', e => {
                if (!sidebar.contains(e.target) && !toggle.contains(e.target)) sidebar.classList.remove('open');
            });
        }
    },

    // ── Topbar user dropdown ───────────────────────────────────
    initTopbarUser(session, logoutUrl = '../index.html') {
        const el = document.querySelector('.topbar-avatar');
        if (el && session) el.textContent = session.avatar || session.name?.[0] || '?';
        const nameEl = document.querySelector('.topbar-username');
        if (nameEl && session) nameEl.textContent = session.name;
        const roleEl = document.querySelector('.topbar-role');
        if (roleEl && session) roleEl.textContent = session.role === 'admin' ? 'Quản trị viên' : 'Sinh viên';

        const userBtn = document.querySelector('.topbar-user');
        const dropdown = document.querySelector('.topbar-dropdown');
        if (userBtn && dropdown) {
            userBtn.addEventListener('click', e => { e.stopPropagation(); userBtn.closest('.dropdown').classList.toggle('open'); });
            document.addEventListener('click', () => userBtn.closest('.dropdown').classList.remove('open'));
        }
        document.querySelectorAll('[data-logout]').forEach(btn => {
            btn.addEventListener('click', () => { Auth.logout(); window.location.href = logoutUrl; });
        });
    },

    // ── Search + filter helper ─────────────────────────────────
    filterItems(items, query, fields) {
        if (!query) return items;
        const q = query.toLowerCase();
        return items.filter(item => fields.some(f => (item[f] || '').toLowerCase().includes(q)));
    },

    // ── Score colour ───────────────────────────────────────────
    scoreColor(score) {
        if (score >= 8) return 'var(--success)';
        if (score >= 6.5) return 'var(--info)';
        if (score >= 5) return 'var(--warning)';
        return 'var(--danger)';
    },

    // ── Generate random stats (for demo charts) ────────────────
    randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

    // ── Export helpers ─────────────────────────────────────────
    exportPDF(title) {
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            this.toast('Đang tải thư viện PDF...', 'warning');
            return false;
        }
        return true;
    }
};
