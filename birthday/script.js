/* =========================================================
   EDIT THIS BLOCK ONLY to personalise the whole website
   ========================================================= */
const CONFIG = {
  name: "Arnab",
  age: 15,
  born: { year: 2011, month: 11, day: 10, timeZoneOffsetMinutes: 330 },
  loaderIntro: "Celebrating 15 amazing years of Arnab...",
  // 🎵 ADD YOUR MUSIC HERE: put your mp3 file in the assets/music/ folder,
  // then type its exact file name below (e.g. "assets/music/happy-birthday.mp3")
  music: "assets/music/whatsapp-audio.mpeg",
  // 📸 ADD YOUR PHOTOS HERE: put your pictures in the assets/images/ folder,
  // then type each exact file name in "src" below. Copy a line to add more photos.
  photos: [
    { src: "summer-always.png", caption: "Summer, always" },
    { src: "that-trip.png", caption: "That trip" },
    { src: "IMG-20261110-WA0012.jpg.jpeg", caption: "A special moment" },
    { src: "pure-joy.jpe", caption: "Pure joy" }
  ],
  // 📸 Timeline photos: use "img" to point to a file in assets/images/ (same idea as above)
  memories: [
    { date: "2011", title: "The beginning of a beautiful story", text: "The day you came into this world, bringing joy, laughter, and a whole new kind of happiness into our lives.", img: "IMG_20261110_083934.png" },
    { date: "2012", title: "First big adventure", text: "We got lost, laughed about it, and never forgot it.", img: "IMG_2012_adventure.png" },
    { date: "2019", title: "Growing up fast", text: "Somewhere along the way you became someone I look up to.", img: "growing-up-fast.jpe" },
    { date: "Today", title: "Another year, another legend", text: "Here's to everything coming next.", img: "IMG-20261110-WA0013.jpg.jpeg" }
  ],
  letterTitle: "Dear brother,",
  letter: [
    "Thank you for being the person who always shows up, even when it's inconvenient, especially when it's inconvenient.",
    "You make the hard days lighter and the good days unforgettable. I hope this year gives back everything you give to everyone else.",
    "Happy birthday. I'm proud of you, always."
  ],
  letterSign: "Your sibling",
  surpriseTitle: "You're my crime partner",
  surpriseText: "Dinner is on me tonight. Pick anywhere you like.",
  finaleTitle: "Happy Birthday!",
  finaleMsg: "May this year be loud, kind and full of the things that make you happiest."
};

/* ---------------- Helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const birthTimeZoneOffset = CONFIG.born.timeZoneOffsetMinutes * 60_000;
const COLORS = ["#ecc27b", "#f28fa0", "#7fdcc8", "#f6efe4", "#b79cff"];
// Fallback art if a photo file is missing, so the layout never breaks
function fallback(i, label) {
  const c = COLORS[i % COLORS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='${i % 2 ? 1000 : 640}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c}'/><stop offset='1' stop-color='#1d1540'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' fill='white' fill-opacity='.8' font-family='Georgia' font-size='40' text-anchor='middle'>${label}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
function img(src, i, alt) {
  const el = new Image(); el.alt = alt; el.loading = "lazy"; el.src = src;
  el.onerror = () => { el.onerror = null; el.src = fallback(i, alt); };
  return el;
}

/* ---------------- Fill content ---------------- */
function build() {
  document.title = `Happy Birthday ${CONFIG.name}`;
  $("#loaderIntro").textContent = CONFIG.loaderIntro;
  $("#hero .kicker").textContent = `Celebrating ${CONFIG.age} amazing years today`;
  $("#cdTitle").textContent = `${CONFIG.name}'s age`;
  $("#heroName").textContent = CONFIG.name;
  $("#letterTitle").textContent = CONFIG.letterTitle;
  $("#letterSign").textContent = CONFIG.letterSign;
  $("#revealTitle").textContent = CONFIG.surpriseTitle;
  $("#revealText").textContent = CONFIG.surpriseText;
  $("#finaleTitle").textContent = CONFIG.finaleTitle;
  $("#finaleMsg").textContent = CONFIG.finaleMsg;

  // Hero headline split into letters for the staggered 3D entrance
  const h1 = $("#hero h1"), t = h1.textContent; h1.textContent = ""; h1.setAttribute("aria-label", t);
  [...t].forEach(ch => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch === " " ? "\u00A0" : ch; s.setAttribute("aria-hidden", "true"); h1.append(s); });

  // Letter: each word wrapped for the reveal
  $("#letterBody").innerHTML = CONFIG.letter.map(p => `<p>${p.split(" ").map(w => `<span class="w">${w}</span>`).join(" ")}</p>`).join("");

  // Gallery
  CONFIG.photos.forEach((p, i) => {
    const f = document.createElement("figure"); f.className = "tile"; f.tabIndex = 0;
    f.append(img(p.src, i, p.caption)); f.insertAdjacentHTML("beforeend", `<figcaption>${p.caption}</figcaption>`);
    const pulseTile = () => {
      f.classList.remove("pulse");
      void f.offsetWidth;
      f.classList.add("pulse");
      window.setTimeout(() => f.classList.remove("pulse"), 500);
    };

    f.onclick = e => {
      pulseTile();
      if (f.dataset.touchTap) {
        delete f.dataset.touchTap;
        if (!f.classList.contains("caption-visible")) {
          f.classList.add("caption-visible");
          return;
        }
      }
      openLB(i);
    };
    f.onpointerdown = e => {
      pulseTile();
      if (e.pointerType !== "touch") return;
      f.dataset.touchTap = "true";
      document.querySelectorAll(".tile.caption-visible").forEach(tile => {
        if (tile !== f) tile.classList.remove("caption-visible");
      });
    };
    f.onkeydown = e => (e.key === "Enter") && (pulseTile(), openLB(i));
    $("#grid").append(f);
  });

  // Timeline
  CONFIG.memories.forEach((m, i) => {
    const li = document.createElement("li"); li.className = "moment";
    li.dataset.date = m.date;
    const card = document.createElement("div"); card.className = "card glass";
    card.append(img(m.img, i, m.title));
    card.insertAdjacentHTML("beforeend", `<time>${m.date}</time><h3>${m.title}</h3><p>${m.text}</p>`);
    li.append(card); $("#timeline").append(li);
    // Subtle 3D tilt on hover (desktop pointers only)
    card.addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; const r = card.getBoundingClientRect(); card.style.transform = `perspective(700px) rotateY(${((e.clientX - r.left) / r.width - .5) * 8}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 8}deg)`; });
    card.addEventListener("pointerleave", () => card.style.transform = "");
  });

  // Balloons
  COLORS.concat(COLORS).forEach((c, i) => {
    const b = document.createElement("i"); b.className = "balloon"; b.style.cssText = `left:${6 + i * 9.5}%;background:${c};color:${c}`; $("#balloons").append(b);
    if (!reduce) gsap.to(b, { y: -(innerHeight + 260), x: (i % 2 ? 1 : -1) * 40, duration: 14 + (i % 4) * 3, delay: i * 1.1, repeat: -1, ease: "none" });
    else b.style.bottom = "20%";
  });
}

/* ---------------- Lightbox ---------------- */
let lbIndex = 0;
const lb = $("#lightbox"), lbImg = $("img", lb);
function showLB(i) {
  lbIndex = (i + CONFIG.photos.length) % CONFIG.photos.length;
  const p = CONFIG.photos[lbIndex];
  gsap.to(lbImg, { opacity: 0, scale: .96, duration: .2, onComplete: () => {
    lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = fallback(lbIndex, p.caption); };
    lbImg.src = p.src; lbImg.alt = p.caption; $("#lbCap").textContent = p.caption;
    gsap.to(lbImg, { opacity: 1, scale: 1, duration: .35 });
  }});
}
function openLB(i) { lb.hidden = false; document.body.style.overflow = "hidden"; showLB(i); }
function closeLB() { lb.hidden = true; document.body.style.overflow = ""; }
$(".lb-x").onclick = closeLB; $(".lb-p").onclick = () => showLB(lbIndex - 1); $(".lb-n").onclick = () => showLB(lbIndex + 1);
lb.onclick = e => { if (e.target === lb) closeLB(); };
addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") closeLB(); if (e.key === "ArrowLeft") showLB(lbIndex - 1); if (e.key === "ArrowRight") showLB(lbIndex + 1); });

/* ---------------- Live countdown ---------------- */
function tickCountdown() {
  const now = new Date(Date.now() + birthTimeZoneOffset);
  let years = now.getUTCFullYear() - CONFIG.born.year;
  const anniversary = new Date(Date.UTC(now.getUTCFullYear(), CONFIG.born.month - 1, CONFIG.born.day));
  if (now < anniversary) years--;
  const yearAnchor = new Date(Date.UTC(CONFIG.born.year + years, CONFIG.born.month - 1, CONFIG.born.day));
  let secondsElapsed = Math.max(0, Math.floor((now.getTime() - yearAnchor.getTime()) / 1000));
  const values = {
    y: years,
    d: Math.floor(secondsElapsed / 86400),
    h: 0,
    m: 0,
    s: 0
  };
  secondsElapsed %= 86400;
  values.h = Math.floor(secondsElapsed / 3600);
  secondsElapsed %= 3600;
  values.m = Math.floor(secondsElapsed / 60);
  values.s = secondsElapsed % 60;

  Object.entries(values).forEach(([unit, value]) => {
    const el = $("#cd-" + unit);
    const display = unit === "y" || unit === "d" ? value : String(value).padStart(2, "0");
    if (el.textContent !== display) el.textContent = display;
  });
}

/* ---------------- Canvas FX: ambient particles, confetti, fireworks ---------------- */
const cv = $("#fx"), cx = cv.getContext("2d");
let W, H, parts = [], ambient = [];
function size() { const r = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * r; H = cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); W /= r; H /= r; }
addEventListener("resize", size); size();
for (let i = 0; i < (innerWidth < 700 ? 25 : 55); i++) ambient.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.8 + .4, v: Math.random() * .3 + .1, c: COLORS[i % 5], a: Math.random() * .5 + .2 });
function confetti(x, y, n = 120, spread = 1) {
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = (Math.random() * 9 + 3) * spread; parts.push({ t: "c", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, w: Math.random() * 8 + 4, h: Math.random() * 5 + 3, rot: Math.random() * 6, vr: Math.random() * .3 - .15, c: COLORS[i % 5], life: 1, g: .22 }); }
}
function rain(n = 140) { for (let i = 0; i < n; i++) parts.push({ t: "c", x: Math.random() * W, y: -20 - Math.random() * H * .6, vx: Math.random() * 2 - 1, vy: Math.random() * 3 + 2, w: 8, h: 5, rot: Math.random() * 6, vr: Math.random() * .2 - .1, c: COLORS[i % 5], life: 1, g: .02 }); }
function firework(x, y) {
  const c = COLORS[Math.floor(Math.random() * 5)];
  for (let i = 0; i < 70; i++) { const a = (i / 70) * Math.PI * 2, s = Math.random() * 5 + 2; parts.push({ t: "f", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, c, life: 1, g: .05 }); }
}
let fwTimer;
function fireworks(ms = 6000) { clearInterval(fwTimer); const end = Date.now() + ms; fwTimer = setInterval(() => { if (Date.now() > end) return clearInterval(fwTimer); firework(Math.random() * W * .8 + W * .1, Math.random() * H * .5 + H * .1); }, 380); }
function frame() {
  cx.clearRect(0, 0, W, H);
  ambient.forEach(p => { p.y -= p.v; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; } cx.globalAlpha = p.a; cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); });
  parts = parts.filter(p => p.life > 0 && p.y < H + 40);
  parts.forEach(p => {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99;
    if (p.t === "f") { p.life -= .014; cx.globalAlpha = Math.max(p.life, 0); cx.fillStyle = p.c; cx.shadowBlur = 8; cx.shadowColor = p.c; cx.fillRect(p.x, p.y, 2.5, 2.5); cx.shadowBlur = 0; }
    else { p.rot += p.vr; p.life -= .004; cx.globalAlpha = Math.min(1, p.life * 2); cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore(); }
  });
  cx.globalAlpha = 1; requestAnimationFrame(frame);
}

/* ---------------- Music (only starts on a click) ---------------- */
const audio = $("#audio"), mBtn = $("#music");
audio.src = CONFIG.music;
mBtn.onclick = () => {
  if (audio.paused) audio.play().then(() => mBtn.classList.add("on")).catch(() => alert("Add your song at " + CONFIG.music + " to enable music."));
  else { audio.pause(); mBtn.classList.remove("on"); }
};

/* ---------------- Animations ---------------- */
function intro() {
  gsap.registerPlugin(ScrollTrigger);
  const tl = gsap.timeline();
  tl.from("#hero .kicker", { opacity: 0, y: 20, duration: .8 })
    .from("#hero h1 .ch", { opacity: 0, rotationX: -90, y: 40, stagger: .05, duration: .9, ease: "back.out(1.6)" }, "-=.4")
    .from("#heroName", { opacity: 0, scale: .85, duration: 1, ease: "power3.out" }, "-=.5")
    .from("#startBtn", { opacity: 0, y: 20, duration: .7 }, "-=.4");
  // Parallax on hero
  gsap.to("#hero h1", { yPercent: 25, ease: "none", scrollTrigger: { trigger: "#hero", scrub: true, start: "top top", end: "bottom top" } });
  const reveal = (sel, vars = {}) => gsap.from(sel, { opacity: 0, y: 50, duration: .9, ease: "power3.out", ...vars, scrollTrigger: { trigger: sel, start: "top 85%" } });
  reveal("#countdown h2"); reveal(".cd-grid .glass", { stagger: .12 });
  reveal("#gallery h2");
  gsap.from(".tile", { opacity: 0, clipPath: "inset(0 0 100% 0)", y: 40, duration: 1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: "#grid", start: "top 80%" } });
  reveal("#memories h2");
  gsap.utils.toArray(".moment").forEach((m, i) => gsap.from(m, { opacity: 0, x: innerWidth < 700 ? 30 : (i % 2 ? 80 : -80), duration: .9, ease: "power3.out", scrollTrigger: { trigger: m, start: "top 85%" } }));
  gsap.from("#letterTitle", { opacity: 0, y: 30, scrollTrigger: { trigger: "#letter", start: "top 60%" } });
  gsap.to(".paper .w", { opacity: 1, stagger: .045, duration: .5, scrollTrigger: { trigger: "#letterBody", start: "top 75%" } });
  gsap.from("#letterSign", { opacity: 0, scrollTrigger: { trigger: "#letterSign", start: "top 95%" }, delay: 1 });
  reveal("#surprise h2"); reveal("#gift", { scale: .6 });
  gsap.from("#finale .big", { opacity: 0, scale: .7, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: "#finale", start: "top 55%", onEnter: finale } });
  gsap.from("#finaleMsg,#replayAll", { opacity: 0, y: 30, stagger: .2, scrollTrigger: { trigger: "#finale", start: "top 40%" } });
}
function finale() { fireworks(6000); rain(150); }

/* ---------------- Gift box ---------------- */
const gift = $("#gift"), rev = $("#reveal");
gift.onclick = () => {
  gift.style.animation = "none";
  const r = gift.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + 30;
  gsap.timeline()
    .to(".gift", { x: "+=6", yoyo: true, repeat: 7, duration: .05 })
    .to(".gift .lid", { y: -90, rotation: -35, opacity: 0, duration: .6, ease: "power2.out", onStart: () => { confetti(x, y, 160); firework(x, y - 80); } })
    .to(gift, { scale: 0, opacity: 0, duration: .4, onComplete: () => { gift.style.display = "none"; } }, "-=.1")
    .set(rev, { display: "block" }).from(rev, { opacity: 0, y: 30, scale: .9, duration: .8, ease: "back.out(1.5)" });
};
$("#replayGift").onclick = () => {
  gsap.to(rev, { opacity: 0, duration: .3, onComplete: () => {
    rev.style.display = "none"; gsap.set(rev, { clearProps: "all" }); rev.style.display = "none";
    gsap.set(".gift .lid", { clearProps: "all" }); gsap.set(".gift", { clearProps: "all" });
    gift.style.display = ""; gift.style.animation = ""; gsap.fromTo(gift, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: "back.out(2)", clearProps: "transform,opacity" });
  }});
};

/* ---------------- Wiring ---------------- */
$("#startBtn").onclick = () => { confetti(innerWidth / 2, innerHeight * .7, 140); document.getElementById("countdown").scrollIntoView({ behavior: "smooth" }); };
$("#replayAll").onclick = () => { scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => { fireworks(5000); rain(120); confetti(innerWidth / 2, innerHeight / 2, 160); }, 600); };

/* ---------------- Boot: loader ---------------- */
build(); tickCountdown(); setInterval(tickCountdown, 1000); frame();
const fill = $("#barFill"), pct = $("#pct"), state = { p: 0 };
document.body.style.overflow = "hidden";
gsap.to(state, { p: 100, duration: reduce ? .2 : 2.6, ease: "power1.inOut", onUpdate: () => { fill.style.width = state.p + "%"; pct.textContent = Math.round(state.p) + "%"; }, onComplete: () => {
  gsap.to("#loader", { yPercent: -100, duration: .9, ease: "power4.inOut", onComplete: () => { $("#loader").remove(); document.body.style.overflow = ""; intro(); } });
}});