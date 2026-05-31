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

// ── ACTIVE NAV HIGHLIGHT ──
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        const isCurrent = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', isCurrent);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObs.observe(s));
