// =====================
// NAVBAR: scroll effect + active link
// =====================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;

        if (scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// =====================
// ALBUM FILTER
// =====================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.album-item').forEach(item => {
            const show = filter === 'all' || item.dataset.cat === filter;
            item.classList.toggle('hidden', !show);
        });
    });
});

// =====================
// MESSAGE BOARD
// =====================
const STORAGE_KEY = 'vivi-messages-v1';
let messages     = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let selectedMood = '❤️';

// Seed default messages so the board doesn't start empty
const defaultMessages = [
    { name: '山露星谷的邻居', mood: '🌿', content: '小黑狗每天在草地上追鸡的样子太可爱了！希望有机会来 Vivi 农场玩！', time: '5月18日 08:00' },
    { name: '黑狗爱好者', mood: '❤️', content: '小黑狗是我见过最可爱的拉布拉多！那个红领巾真的太配它了！', time: '5月18日 10:30' },
    { name: '阳光小熊', mood: '🐾', content: '听说你把 Vivi 的垃圾桶翻了？哈哈哈太有个性了！', time: '5月18日 14:22' },
];

if (messages.length === 0) {
    messages = defaultMessages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Mood picker
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMood = btn.dataset.mood;
    });
});

// Char counter
const msgContent = document.getElementById('msgContent');
const charCount  = document.getElementById('charCount');

msgContent.addEventListener('input', () => {
    charCount.textContent = msgContent.value.length;
});

// Submit
document.getElementById('submitMsg').addEventListener('click', () => {
    const name    = document.getElementById('msgName').value.trim();
    const content = msgContent.value.trim();

    if (!name)    { shake(document.getElementById('msgName'));    return; }
    if (!content) { shake(msgContent); return; }

    const now = new Date();
    const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    messages.unshift({ name, mood: selectedMood, content, time: timeStr });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    renderMessages();
    updateFooterCount();

    document.getElementById('msgName').value = '';
    msgContent.value = '';
    charCount.textContent = '0';
});

function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shakeInput 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    el.focus();
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function renderMessages() {
    const list = document.getElementById('messagesList');

    if (messages.length === 0) {
        list.innerHTML = `
            <div class="empty-board">
                <div class="empty-board-icon">🐾</div>
                <p>Vivi 在等待第一条留言...</p>
                <p>快来打个招呼吧！</p>
            </div>`;
        return;
    }

    list.innerHTML = messages.map(msg => `
        <div class="message-card">
            <div class="msg-header">
                <span class="msg-mood">${msg.mood}</span>
                <span class="msg-name">${escapeHtml(msg.name)}</span>
                <span class="msg-time">${msg.time}</span>
            </div>
            <p class="msg-text">${escapeHtml(msg.content)}</p>
        </div>
    `).join('');
}

function updateFooterCount() {
    const el = document.getElementById('footerMsgCount');
    if (el) el.textContent = messages.length;
}

// =====================
// SCROLL REVEAL
// =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.about-card, .timeline-card, .fav-card, .album-item, .personality-section'
).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
});

// =====================
// INIT
// =====================
renderMessages();
updateFooterCount();
