/* ─── NEURAL NETWORK CANVAS ───────────────────────────────── */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Node {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : -10;
      this.r  = Math.random() * 2 + 1;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.alpha = Math.random() * .5 + .2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
  }

  function initNodes() {
    nodes = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) nodes.push(new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 140;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,190,61,${nodes[i].alpha})`;
      ctx.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * .15;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,190,61,${alpha})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize(); initNodes(); draw();

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { cancelAnimationFrame(animId); resize(); initNodes(); draw(); }, 200);
  });
})();

/* ─── TERMINAL TYPING ──────────────────────────────────────── */
(function () {
  const el = document.getElementById('termCmd');
  if (!el) return;
  const text = 'run portfolio.py';
  let i = 0;
  const type = () => {
    if (i <= text.length) { el.textContent = text.slice(0, i++); setTimeout(type, 80); }
  };
  setTimeout(type, 600);
})();

/* ─── HAMBURGER ───────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ─── NAV SCROLL ──────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.background =
    window.scrollY > 60 ? 'rgba(8,8,15,0.97)' : 'rgba(8,8,15,0.85)';
});

/* ─── INTERSECTION OBSERVER ───────────────────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');

    el.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    el.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const step = target / (1400 / 16);
      let current = 0;
      const tick = () => {
        current = Math.min(current + step, target);
        counter.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(tick);
        else counter.textContent = target;
      };
      tick();
    });

    io.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

/* ─── ACTIVE NAV ──────────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--amber)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => secObs.observe(s));
