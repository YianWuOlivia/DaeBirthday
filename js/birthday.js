const LS_UNLOCKED = "birthday_unlocked";
const LS_NAME = "birthday_name";
const LS_JUST_UNLOCKED = "birthday_just_unlocked";

function isUnlocked() {
  return localStorage.getItem(LS_UNLOCKED) === "1";
}

if (!isUnlocked()) {
  window.location.href = "index.html";
}

// ===== Confetti (simple burst) =====
function confettiBurst() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animating = false;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const w = window.innerWidth;
  const h = window.innerHeight;
  const origin = { x: w * 0.5, y: h * 0.25 };
  const count = 180;

  particles = Array.from({ length: count }, () => ({
    x: origin.x,
    y: origin.y,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -10 - 6,
    g: 0.22 + Math.random() * 0.10,
    s: 4 + Math.random() * 6,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
    life: 130 + Math.random() * 60,
  }));

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((p) => p.life > 0);

    for (const p of particles) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    }

    if (particles.length) {
      requestAnimationFrame(tick);
    } else {
      animating = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  if (!animating) {
    animating = true;
    requestAnimationFrame(tick);
  }
}

// Celebrate once when arriving from successful login
if (localStorage.getItem(LS_JUST_UNLOCKED) === "1") {
  localStorage.removeItem(LS_JUST_UNLOCKED);
  confettiBurst();
}

// ===== Header + Greeting =====
const nameEl = document.getElementById("name");
const todayEl = document.getElementById("today");
const logoutBtn = document.getElementById("logoutBtn");

const openBtn = document.getElementById("openBtn");
const reveal = document.getElementById("reveal");
const msg = document.getElementById("msg");

const storedName = localStorage.getItem(LS_NAME) || "Friend";
nameEl.textContent = storedName;

todayEl.textContent = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

openBtn.addEventListener("click", () => {
  reveal.classList.add("show");
  msg.textContent =`
  TO: Aileen

    展信佳! 🪿

    今天有一只聪明善良自信大方勇敢美丽诚实仗义阳光开朗上进坚强的大鹅20岁了。本鹅王非常荣幸有这么好的朋友！
    很想念以前每天都能见到面的时候，虽然我们大学离的远，但希望我们一直是巨好的鹅朋鹅友！有空我过来找你玩（虽然没有很多假期😭😭）
    我祝你一直开心，顺利毕业变成 Dr.Dae！也祝我们从1开头认识的，现在到2开头，接下来3，4，5…一直继续认识到重新1开头！！！（100岁）

  爱你的大鹅  
  Olivia
`;
videoWrap.classList.remove("show");
videoBtn.textContent = "开启皇冠交接仪式👑";
birthdayVideo.pause();
birthdayVideo.currentTime = 0;
}
);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(LS_UNLOCKED);
  localStorage.removeItem(LS_NAME);
  window.location.href = "index.html";
});

// ===== Goose click sound (bigger goose = louder) =====
const base = document.getElementById("gooseSound");
const gooseLine = document.querySelector(".goose-line");

if (base && gooseLine) {
  gooseLine.addEventListener("click", (e) => {
    const goose = e.target.closest("span");
    if (!goose) return;

    const i = Number(getComputedStyle(goose).getPropertyValue("--i")) || 0;

    // Clone so rapid clicks overlap nicely
    const s = base.cloneNode(true);

    // volume: small geese quiet, big geese loud (cap at 1.0)
    s.volume = Math.min(0.35 + i * 0.04, 1.0);

    s.play().catch(console.error);
  });
}

// ===== 3D Carousel (GSAP + Draggable) =====
(function initCarousel3D() {
  if (typeof gsap === "undefined" || typeof Draggable === "undefined") {
    console.error("GSAP/Draggable not loaded. Check script tags in birthday.html");
    return;
  }

  const ring = document.getElementById("ring");
  const dragger = document.getElementById("dragger");
  if (!ring || !dragger) return;

  let xPos = 0;

  const imageUrls = [
    "assets/images/1.jpg",
    "assets/images/9.jpg",
    "assets/images/2.jpg",
    "assets/images/3.jpg",
    "assets/images/4.jpg",
    "assets/images/5.jpg",
    "assets/images/6.jpg",
    "assets/images/7.jpg",
    "assets/images/8.jpg",
    "assets/images/10.jpg",
  ];

  const COUNT = imageUrls.length;
  const STEP = 360 / COUNT; // 36° for 10 images
  const RADIUS = 440;       // increase to show more of side cards

  gsap.set(ring, { rotationY: 180 });

  gsap.set(".carousel3d .img", {
    rotateY: (i) => i * -STEP,
    transformOrigin: `50% 50% ${RADIUS}px`,
    z: -RADIUS,
    backgroundImage: (i) => `url(${imageUrls[i % COUNT]})`,
    backgroundPosition: "center center",
    backfaceVisibility: "hidden",
  });

  gsap.from(".carousel3d .img", {
    duration: 1.1,
    y: 120,
    opacity: 0,
    stagger: 0.08,
    ease: "expo.out",
  });

  Draggable.create(dragger, {
    onDragStart: (e) => {
      if (e.touches) e.clientX = e.touches[0].clientX;
      xPos = Math.round(e.clientX);
    },
    onDrag: (e) => {
      if (e.touches) e.clientX = e.touches[0].clientX;

      gsap.to(ring, {
        rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
        duration: 0.05,
        overwrite: true,
      });

      xPos = Math.round(e.clientX);
    },
    onDragEnd: () => {
      gsap.set(dragger, { x: 0, y: 0 });
    },
  });
})();

const videoBtn = document.getElementById("videoBtn");
const videoWrap = document.getElementById("videoWrap");
const birthdayVideo = document.getElementById("birthdayVideo");

videoBtn.addEventListener("click", () => {
  const isNowShown = videoWrap.classList.toggle("show");
  videoBtn.textContent = isNowShown ? "收起视频" : "开启皇冠交接仪式👑";

  if (isNowShown) {
    birthdayVideo.play().catch(() => {});
  } else {
    birthdayVideo.pause();
    birthdayVideo.currentTime = 0; // remove if you want resume instead
  }
});

