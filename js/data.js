// (API_BASE_URL is now defined in config.js)

const DB = {
  users: [],
  exams: [],
  questions: {}, // will be populated lazily or returned via API
  results: [],

  // ---- Helpers ----
  getUser(username) { return this.users.find(u => u.username === username); },
  getExam(id) { return this.exams.find(e => String(e.id) === String(id)); },
  getQuestions(examId) { return this.questions[examId] || []; },
  getStudents() { return this.users.filter(u => u.role === 'student'); },
  getUserById(id) { return this.users.find(u => String(u.id) === String(id)); },
  getResultsByUser(userId) { return this.results.filter(r => String(r.userId) === String(userId) || String(r.user_id) === String(userId)); },
  getResultsByExam(examId) { return this.results.filter(r => String(r.examId) === String(examId) || String(r.exam_id) === String(examId)); },
  getResult(userId, examId) { return this.results.find(r => (String(r.userId) === String(userId) || String(r.user_id) === String(userId)) && (String(r.examId) === String(examId) || String(r.exam_id) === String(examId))); },

  // ---- Async API-compatible methods ----
  async load() {
    const session = Auth.getSession();
    if (!session) return;
    try {
      const authHeader = { 'Authorization': `Bearer ${session.token}` };
      const [usersRes, examsRes, resultsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { headers: authHeader }),
        fetch(`${API_BASE_URL}/exams`, { headers: authHeader }),
        fetch(`${API_BASE_URL}/results`, { headers: authHeader })
      ]);
      
      if (usersRes.ok) this.users = await usersRes.json();
      if (examsRes.ok) this.exams = await examsRes.json();
      if (resultsRes.ok) this.results = await resultsRes.json();
    } catch (e) {
      console.error('Error loading DB from API:', e);
    }
  },

  async loadMyResults() {
    const session = Auth.getSession();
    if (!session) return [];
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/results/my-results`);
        if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return [];
  },

  async loadAllResults() {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/results`);
        if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return [];
  },

  async loadExamResults(examId) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/results/exam/${examId}`);
        if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return [];
  },

  async getExamDetails(examId) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/exams/${examId}`);
        if (res.ok) {
            const exam = await res.json();
            if (exam.questions) {
                this.questions[examId] = exam.questions;
            }
            return exam;
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async getExamResult(examId) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/results/exam-result/${examId}`);
        if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return null;
  },

  async submitExam(examId, answersPayload, durationMins) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/results/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ examId, answers: answersPayload, duration: durationMins })
        });
        const data = await res.json();
        if (res.ok) {
             return { success: true, result: data.result };
        }
    } catch (e) { console.error(e); }
    return { success: false };
  },

  // Admin mock methods
  async addUser(userData) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar,
                studentId: userData.studentId,
                className: userData.class
            })
        });
        const data = await res.json();
        if (res.ok) {
             const newUser = { id: data.id, ...userData };
             this.users.push(newUser);
             return newUser;
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async updateUser(id, updateData) {
    try {
        const payload = { ...updateData };
        if (payload.class) payload.className = payload.class;
        
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
             const idx = this.users.findIndex(u => String(u.id) === String(id));
             if (idx >= 0) this.users[idx] = { ...this.users[idx], ...updateData };
             return this.users[idx];
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async deleteUser(id) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            this.users = this.users.filter(u => String(u.id) !== String(id));
            return { message: 'User deleted' };
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async createExam(examData) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/exams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData)
        });
        const data = await res.json();
        if (res.ok) {
            const newExam = { id: data.id, questionCount: 0, attempts: 0, createdAt: new Date().toISOString().slice(0,10), ...examData };
            this.exams.push(newExam);
            return newExam;
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async updateExam(examId, examData) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/exams/${examId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData)
        });
        if (res.ok) {
            const idx = this.exams.findIndex(e => String(e.id) === String(examId));
            if (idx >= 0) this.exams[idx] = { ...this.exams[idx], ...examData };
            return this.exams[idx];
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async deleteExam(examId) {
    try {
        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/exams/${examId}`, { method: 'DELETE' });
        if (res.ok) {
            this.exams = this.exams.filter(e => String(e.id) !== String(examId));
            delete this.questions[examId];
            return { message: 'Exam deleted' };
        }
    } catch (e) { console.error(e); }
    return null;
  },

  async upsertExamQuestions(examId, questionsArr) {
    try {
        const finalPayload = questionsArr.map(q => {
             return {
                 content: q.content,
                 explanation: q.explanation,
                 options: q.options
             };
        });

        const res = await Auth.fetchWithAuth(`${API_BASE_URL}/exams/${examId}/questions`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload)
        });
        if (res.ok) {
            this.questions[String(examId)] = questionsArr;
            const idx = this.exams.findIndex(e => String(e.id) === String(examId));
            if (idx >= 0) this.exams[idx].questionCount = questionsArr.length;
            return { message: 'Questions updated' };
        }
    } catch (e) { console.error(e); }
    return null;
  },

  save() { /* no-op */ }
};
