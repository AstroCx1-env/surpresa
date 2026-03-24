const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let hearts = [];
let formedHearts = [];
let targets = [];

// ❤️ Forma do coração
function heartShape(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

// 🎯 Gerar pontos do coração (MENOR E CENTRALIZADO)
function generateHeartTargets() {
  targets = [];

  // 🔥 ESCALA REDUZIDA (ANTES ERA /25)
  let scale = Math.min(canvas.width, canvas.height) / 35;

  // margem pra não sair da tela
  let offsetX = canvas.width / 2;
  let offsetY = canvas.height / 2;

  for (let i = 0; i < 180; i++) {
    let t = Math.random() * Math.PI * 2;
    let pos = heartShape(t);

    targets.push({
      x: offsetX + pos.x * scale,
      y: offsetY - pos.y * scale
    });
  }
}

// 📱 Responsivo
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = Math.min(350, window.innerHeight * 0.5);

  generateHeartTargets();
}

resize();
window.addEventListener("resize", resize);

// 💖 Disparo dos ursinhos (MAIS RÁPIDO)
function shootHeart(side) {
  let startX = side === "left" ? canvas.width * 0.15 : canvas.width * 0.85;
  let startY = canvas.height - 30;

  let target = targets[Math.floor(Math.random() * targets.length)];

  hearts.push({
    x: startX,
    y: startY,
    tx: target.x,
    ty: target.y,
    arrived: false
  });
}

// 🔥 MAIS CORAÇÕES POR SEGUNDO
setInterval(() => {
  shootHeart("left");
  shootHeart("right");
}, 150);

// 🎬 Animação
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach(h => {
    if (!h.arrived) {
      // 🔥 MAIS RÁPIDO
      h.x += (h.tx - h.x) * 0.12;
      h.y += (h.ty - h.y) * 0.12;

      if (Math.abs(h.x - h.tx) < 1 && Math.abs(h.y - h.ty) < 1) {
        h.arrived = true;
        formedHearts.push({ x: h.tx, y: h.ty });
      }
    }
  });

  // 💖 voando
  hearts.forEach(h => {
    ctx.fillStyle = "#ff4d6d";
    ctx.beginPath();
    ctx.arc(h.x, h.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // ❤️ formado
  formedHearts.forEach(p => {
    ctx.fillStyle = "#ff4d6d";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

// ▶️ Start
function start() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  animate();

  setTimeout(() => {
    document.getElementById("nomes").style.opacity = 1;
  }, 2000);

  setTimeout(() => {
    document.getElementById("timer").style.opacity = 1;
    document.getElementById("frase").style.opacity = 1;
  }, 3500);
}

// ⏱️ TIMER
const startDate = new Date("2022-03-25");

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  document.getElementById("timer").innerHTML =
    `${days} dias ${hours}h ${minutes}m ${seconds}s ❤️`;
}

setInterval(updateTimer, 1000);

// 👀 animação ao aparecer na tela
const fotos = document.querySelectorAll(".foto");

function mostrarFotos() {
  const trigger = window.innerHeight * 0.85;

  fotos.forEach(foto => {
    const top = foto.getBoundingClientRect().top;

    if (top < trigger) {
      foto.classList.add("show");
    }
  });
}

window.addEventListener("scroll", mostrarFotos);