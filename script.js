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
// FIREBASE
// =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDqpBTdl00WkhBdzfecP8JUKodyp50Is5g",
    authDomain: "vivi-world-bdcdd.firebaseapp.com",
    databaseURL: "https://vivi-world-bdcdd-default-rtdb.firebaseio.com",
    projectId: "vivi-world-bdcdd",
    storageBucket: "vivi-world-bdcdd.firebasestorage.app",
    messagingSenderId: "1050055403050",
    appId: "1:1050055403050:web:766834fdb6de9039b80553"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');

// =====================
// MESSAGE BOARD
// =====================
let messages     = [];
let selectedMood = '❤️';

// Listen for real-time updates from Firebase
onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        messages = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
    } else {
        messages = [];
    }
    renderMessages();
    updateFooterCount();
});

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

    push(messagesRef, { name, mood: selectedMood, content, time: timeStr, timestamp: Date.now() });

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
// renderMessages and updateFooterCount are triggered by the Firebase onValue listener above
