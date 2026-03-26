// Match headshot width to h1 name width
function matchPhotoToName() {
  const h1 = document.querySelector('#hero h1');
  const photo = document.querySelector('.hero-photo');
  if (h1 && photo) {
    photo.style.width = h1.offsetWidth + 'px';
  }
}
window.addEventListener('load', matchPhotoToName);
window.addEventListener('resize', matchPhotoToName);

// Dark mode toggle
const toggle = document.getElementById('dark-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);
toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ===== HERO CANVAS ANIMATION =====
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

const NODES = 55;
const nodes = Array.from({ length: NODES }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  label: Math.random() > 0.6 ? (Math.random() > 0.5 ? Math.floor(Math.random() * 999).toString() : ['SQL','ETL','BI','KPI','DAX','PY','%','$','#'][Math.floor(Math.random()*9)]) : null,
}));

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = root.getAttribute('data-theme') === 'dark';
  const lineColor = isDark ? 'rgba(0,194,168,0.18)' : 'rgba(0,102,255,0.1)';
  const dotColor  = isDark ? 'rgba(0,194,168,0.5)'  : 'rgba(0,194,168,0.6)';
  const textColor = isDark ? 'rgba(0,194,168,0.35)' : 'rgba(0,102,255,0.25)';

  // Draw connecting lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 1 - dist / 140;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  // Draw nodes and labels
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    if (n.label) {
      ctx.font = '10px Courier New';
      ctx.fillStyle = textColor;
      ctx.fillText(n.label, n.x + 6, n.y + 4);
    }

    // Move
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ===== SCROLL FADE-IN =====
const fadeEls = document.querySelectorAll('.skill-card, .achievement-card, .timeline-item, .education-card');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 50}ms, transform 0.5s ease ${i * 50}ms`;
  fadeObserver.observe(el);
});

// Add utility styles
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; } nav a.active { color: #00c2a8; }`;
document.head.appendChild(style);
