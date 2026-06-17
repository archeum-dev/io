/* Archeum site - minimal behaviour. Header state, mobile nav, subtle
   scroll reveals. Motion is disabled under prefers-reduced-motion, and
   content is never hidden unless JS is confirmed present (html.js). */

import { initFlow } from './flow.js';
import { initLife } from './life.js';

// main.js loaded: disarm the inline failsafe; we control reveals now.
if (window.__revealFailsafe) clearTimeout(window.__revealFailsafe);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Mobile nav ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---- Header background on scroll ---- */
const header = document.getElementById('header');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('scrolled', y > 8);
    // Scroll vein: map scroll position to a 0..1 fill, anchored to doc height.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--vein', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Animated @handle: shuffle a big pool of names, roll each one up and out
       with a fade, and glide the @ sideways as the name resizes ---- */
const nameEl = document.getElementById('handleName');
if (nameEl && !reduceMotion) {
  const roll = nameEl.parentElement;
  const names = [
    'alice','ava','ada','mia','zoe','eve','ivy','uma','nora','lily','ruby','jade','cora','lola',
    'maya','isla','elsa','emma','lana','nina','rosa','vera','cleo','juno','kira','june','gigi','dora',
    'bea','tessa','mara','clara','alma','frida','paula','elena','sofia','lucia','ines','aria','rina',
    'aiko','naomi','leah','leo','kai','max','rex','sam','ben','jay','roy','sol','tom','finn','theo',
    'noah','liam','milo','otto','remy','hugo','enzo','luca','nico','mateo','diego','pablo','bruno',
    'marco','paolo','dante','pedro','jorge','ramon','ravi','dev','neel','rohan','arjun','kiran','rohit',
    'aryan','asha','riya','isha','priya','kavya','tara','anya','esha','nisha','omar','amir','karim',
    'tariq','samir','mehdi','hassan','yusuf','layla','zara','dina','rana','salma','yara','leila','noor',
    'nadia','hana','mina','sora','kenji','yuki','haru','akira','hiro','taro','yuna','mei','jun','lin',
    'wei','soo','jin','ren','kaito','rei',
  ];
  // Fisher–Yates shuffle
  for (let k = names.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    const t = names[k]; names[k] = names[j]; names[j] = t;
  }

  // Hidden measurer (inherits the handle font) so the @ can glide to an exact width.
  const meas = document.createElement('span');
  meas.setAttribute('aria-hidden', 'true');
  meas.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;white-space:nowrap';
  roll.appendChild(meas);
  // Box is sized to the exact name width; the sides never clip (see clip-path).
  const widthOf = (t) => {
    meas.textContent = t;
    return Math.ceil(meas.getBoundingClientRect().width) + 2;
  };

  // Two stacked names: one showing, one waiting just below. Each swap crosses
  // them over together, the box widens to fit the longer of the two while they
  // move, then shrinks back to the new name if it is shorter.
  roll.classList.add('rolling');
  const nameB = document.createElement('span');
  nameB.className = 'name below';
  roll.appendChild(nameB);
  let active = nameEl, idle = nameB;
  roll.style.width = widthOf(active.textContent) + 'px';

  const T = 720; // crossover length, matched to the CSS transition
  let i = -1;
  setInterval(() => {
    if (document.hidden) return;   // skip the forced-layout read + transitions while backgrounded
    i = (i + 1) % names.length;
    const n = names[i];
    // stage the incoming name just below the window
    idle.textContent = n;
    idle.classList.add('below');
    idle.classList.remove('out');
    void idle.offsetWidth;
    // Resize the box straight to the new width, in sync with the crossover, so
    // the @ glides in one motion both ways. clip-path means the wider name never
    // clips while the box is mid-resize, so no max-then-shrink dance is needed.
    roll.style.width = widthOf(n) + 'px';
    // cross them over: the old name rises out as the new one rises in
    active.classList.add('out');
    idle.classList.remove('below');
    // after the crossover, reset the old name and swap roles
    setTimeout(() => {
      active.classList.remove('out');
      active.classList.add('below');
      const tmp = active; active = idle; idle = tmp;
    }, T);
  }, 3800);

  // The handle font is fluid, so keep the reserved width correct on resize.
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { roll.style.width = widthOf(active.textContent) + 'px'; }, 150);
  }, { passive: true });
}

/* ---- Scroll reveals ---- */
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---- Full-page pager: one beat per scroll gesture (landing only) ----
   Wheel / keys / touch advance exactly one page; the scrollbar can't dribble
   between them. The footer is the last page, so it stays reachable. Disabled
   under reduced motion (native scroll), and on the doc pages (the page list is
   too short). Keys are ignored while a link/button is focused, so the CTAs and
   keyboard navigation keep working. */
if (!reduceMotion) {
  const pages = [...document.querySelectorAll('.hero, .beat'), document.querySelector('.site-footer')].filter(Boolean);
  if (pages.length > 1) {
    let locked = false;
    const indexNow = () => {
      let best = 0, dist = Infinity;
      pages.forEach((p, i) => {
        const d = Math.abs(p.getBoundingClientRect().top);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    };
    const goTo = (t) => {
      locked = true;
      pages[t].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { locked = false; }, 820);
    };
    const step = (dir) => {
      if (locked) return;
      const i = indexNow();
      const t = Math.max(0, Math.min(pages.length - 1, i + dir));
      if (t !== i) goTo(t);
    };

    window.addEventListener('wheel', (e) => {
      e.preventDefault();              // the wheel only ever moves whole pages
      if (Math.abs(e.deltaY) > 6) step(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
      if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(pages.length - 1); }
    });

    // Touch is handled natively by CSS scroll-snap on mobile (see styles.css):
    // mandatory snap + scroll-snap-stop:always halts at every section, even on a
    // fast fling, and stays in step with the URL bar. A JS touch pager fighting
    // native momentum was the source of the "scrolls past everything" jank.
  }
}

/* ---- Flow diagrams: app servers stream into your phone (renting), then your
       phone streams out to your peers (pocket) ---- */
initFlow(document.getElementById('flowRent'), { peers: 5, peerType: 'server', dir: 'in', layout: 'topRow', lineColor: 'rgba(255,255,255,0.18)', burstColor: '#ffffff', centerFace: ':(' });
initLife(document.getElementById('lifeBg'));
initFlow(document.getElementById('flowPocket'), { peers: 6, peerType: 'phone', dir: 'out', centerGold: true, ring: true, lineColor: 'rgba(212,175,55,0.55)', ringLineColor: 'rgba(212,175,55,0.16)', burstColor: '#ffecc0' });
