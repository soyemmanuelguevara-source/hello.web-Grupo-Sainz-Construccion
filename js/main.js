const services = [
  "Plomeria",
  "Electricidad",
  "Instalacion de gas",
  "Calderas y boilers",
  "Impermeabilizacion",
  "Remodelaciones",
  "Cisternas",
  "Filtracion de agua",
  "Bombas hidroneumaticas",
  "Energia solar",
  "Movimiento de tierras",
  "Pintura",
  "Albanileria"
];

const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  window.setTimeout(() => loader?.classList.add("is-hidden"), 650);
});

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mob-menu");

const setNavState = () => {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

hamburger?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.toggle("is-open");
  hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navbar?.classList.toggle("is-open", Boolean(isOpen));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    navbar?.classList.remove("is-open");
    hamburger?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

document.querySelectorAll(".amb-img").forEach((image) => {
  image.addEventListener("error", () => {
    image.closest(".amb-card")?.classList.add("media-fallback");
  }, { once: true });
});

const marquee = document.getElementById("marquee");
if (marquee) {
  const content = services.map((service) => `<span>${service}</span>`).join("");
  marquee.innerHTML = content + content;
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll(".stat-num");
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const node = entry.target;
    const target = Number(node.dataset.count || 0);
    const suffix = node.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(node);
  });
}, { threshold: 0.45 });

counters.forEach((counter) => countObserver.observe(counter));

const canvas = document.getElementById("hero-canvas");
const ctx = canvas?.getContext("2d");
let points = [];
let rafId;

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const total = Math.min(72, Math.floor(window.innerWidth / 18));
  points = Array.from({ length: total }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25,
    size: Math.random() * 1.8 + .8
  }));
};

const drawCanvas = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(255, 102, 0, .72)";
  ctx.strokeStyle = "rgba(255, 255, 255, .09)";
  ctx.lineWidth = 1;

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;
    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    ctx.fill();

    for (let i = index + 1; i < points.length; i += 1) {
      const other = points[i];
      const dx = point.x - other.x;
      const dy = point.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 118) {
        ctx.globalAlpha = 1 - distance / 118;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });

  rafId = requestAnimationFrame(drawCanvas);
};

if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  drawCanvas();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rafId);
    resizeCanvas();
    drawCanvas();
  }, { passive: true });
}

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("wa-form")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("f-name");
  const interest = document.getElementById("f-interest");
  const message = document.getElementById("f-msg");

  if (!name.value.trim()) {
    name.focus();
    return;
  }

  if (!message.value.trim()) {
    message.focus();
    return;
  }

  const text = [
    "Hola, visite el sitio web de Grupo Sainz Construccion y quiero solicitar un presupuesto.",
    `Nombre: ${name.value.trim()}`,
    `Servicio: ${interest.value}`,
    `Detalle: ${message.value.trim()}`
  ].join("\n");

  window.open(`https://wa.me/527771429178?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});
