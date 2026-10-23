// ── NAV: scroll border + mobile ──
const header  = document.getElementById('header');
const burger  = document.getElementById('nav-burger');
const navMenu = document.getElementById('nav-menu');

// Debounce scroll listener for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, 0);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-menu a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
  // Add keyboard support
  a.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') a.click();
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── HERO STAT COUNTER ──
function runCounter(el) {
  const end  = parseInt(el.dataset.count || el.textContent, 10);
  if (isNaN(end)) return;
  const dur  = 1400;
  const fps  = 60;
  const step = end / (dur / (1000 / fps));
  let   cur  = 0;
  const t    = setInterval(() => {
    cur += step;
    if (cur >= end) { el.textContent = end; clearInterval(t); }
    else el.textContent = Math.floor(cur);
  }, 1000 / fps);
}

// ── INTERSECTION OBSERVER ──
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {

  // Animate hero meta numbers on load (delay slightly)
  setTimeout(() => {
    document.querySelectorAll('.meta-num').forEach(el => {
      const original = el.textContent.replace('+', '');
      const hasPlus  = el.textContent.includes('+');
      el.textContent = '0';
      const end = parseInt(original, 10);
      const dur = 1200;
      const step = end / (dur / 16);
      let cur = 0;
      const t = setInterval(() => {
        cur += step;
        if (cur >= end) {
          el.textContent = end + (hasPlus ? '+' : '');
          clearInterval(t);
        } else {
          el.textContent = Math.floor(cur) + (hasPlus ? '+' : '');
        }
      }, 16);
    });
  }, 400);

  // Reveal animations — attach class and observe
  const revealTargets = [
    '.hero-eyebrow',
    '.hero-heading',
    '.hero-body',
    '.hero-actions',
    '.hero-meta',
    '.about-lead',
    '.about-body',
    '.about-links',
    '.featured-card',
    '.skills-intro',
    '.role',
    '.cert-item',
    '.edu-block',
    '.contact-heading',
    '.contact-body',
    '.contact-methods',
    '.skill-row',
  ];

  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.06) + 's';
      io.observe(el);
    });
  });

  // Hero elements animate immediately (no delay)
  ['.hero-eyebrow', '.hero-heading', '.hero-body', '.hero-actions', '.hero-meta'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // Override delay for hero
      el.style.transitionDelay = '0s';
    });
  });

  setTimeout(() => {
    ['.hero-eyebrow', '.hero-heading', '.hero-body', '.hero-actions', '.hero-meta'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('in'));
    });
  }, 80);

  // Initialize dynamic local time indicator
  initLocalTime();
  
  // Preload critical images if they exist
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    });
  }

});

// ── DYNAMIC LOCAL TIME (HYDERABAD) ──
function initLocalTime() {
  const timeEl = document.getElementById('local-time');
  if (!timeEl) return;

  const update = () => {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    try {
      const timeStr = new Date().toLocaleTimeString('en-US', options);
      timeEl.textContent = timeStr;
    } catch (e) {
      const d = new Date();
      const ist = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
      timeEl.textContent = ist.toUTCString().replace('GMT', 'IST');
    }
  };

  update();
  setInterval(update, 1000);
}

// ── ACTIVE NAV & DOCK HIGHLIGHT ──
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a');
const dockLinks = document.querySelectorAll('.dock-link');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const targetHash = '#' + entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === targetHash);
      });
      dockLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === targetHash);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(s => navObs.observe(s));

// ── THEME SWITCHER (DARK / LIGHT) ──
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
    } else {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
    }
  }
}

// ── EXPERIENCE ACCORDION TOGGLE ──
window.toggleRole = function(btn) {
  const content = btn.nextElementSibling;
  const isExpanded = btn.classList.toggle('expanded');
  btn.setAttribute('aria-expanded', isExpanded);
  if (content) {
    content.classList.toggle('expanded', isExpanded);
  }
};

// Initialize theme on load
initTheme();

